const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { OpenAI } = require('openai');
const { transcribeWithTimestamps } = require('./utils/helpers'); // Вспомогательная функция для работы с Whisper

// Настройка Express
const app = express();
const upload = multer({ dest: 'uploads/' });

// OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Убедитесь, что у вас есть ключ OpenAI
});

interface PauseSegment {
    start: number;
    end: number;
}

interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

// Загружаем видео, обрабатываем его
app.post('/process-video', upload.single('video'), async (req: any, res: any) => {
    const videoPath = req.file?.path;
    const audioPath = videoPath + '.wav';

    try {
        // 1. Извлечение аудио из видео
        await extractAudio(videoPath, audioPath);

        // 2. Распознаем речь с таймкодами
        const transcript = await transcribeWithTimestamps(audioPath);

        // 3. Отправляем текст в ChatGPT для анализа пауз
        const pauses = await detectPausesWithChatGPT(transcript);

        // 4. Удаляем паузы из видео
        const outputPath = 'outputs/' + path.basename(videoPath) + '_cut.mp4';
        await cutPausesFromVideo(videoPath, pauses, outputPath);

        res.download(outputPath);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обработке видео');
    } finally {
        // Очистка временных файлов
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
    }
});

// Извлечение аудио из видео
// Извлечение аудио
function extractAudio(videoPath: string, audioPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .noVideo()
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioFrequency(16000)
            .save(audioPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

// Функция для удаления пауз из видео
function cutPausesFromVideo(videoPath: string, pauses: PauseSegment[], outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const segments: { start: number; end?: number }[] = [];
        let lastEnd = 0;

        for (const pause of pauses) {
            segments.push({ start: lastEnd, end: pause.start });
            lastEnd = pause.end;
        }
        segments.push({ start: lastEnd });

        const filters = segments.map((seg, i) => {
            return `[0:v]trim=start=${seg.start}${seg.end ? `:end=${seg.end}` : ''},setpts=PTS-STARTPTS[v${i}];` +
                `[0:a]atrim=start=${seg.start}${seg.end ? `:end=${seg.end}` : ''},asetpts=PTS-STARTPTS[a${i}]`;
        }).join('');

        const concatInputs = segments.map((_, i) => `[v${i}][a${i}]`).join('');
        const concatFilter = `${concatInputs}concat=n=${segments.length}:v=1:a=1[outv][outa]`;

        ffmpeg(videoPath)
            .complexFilter(filters + ';' + concatFilter, ['outv', 'outa'])
            .outputOptions('-map', '[outv]', '-map', '[outa]')
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}
// Функция для анализа пауз с помощью ChatGPT
async function detectPausesWithChatGPT(transcript: TranscriptSegment[]): Promise<PauseSegment[]> {
    const prompt = `
    Удали все длинные паузы из видео. Учитывай только сегменты без речи длительностью более 1.5 секунд.
    Верни массив таймкодов пауз в формате: [{ start: 12.5, end: 14.3 }, ...]
    Вот расшифровка речи с таймкодами:
    ${JSON.stringify(transcript)}
  `;

    const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
    });

    const json = res.choices[0].message.content ?? '[]';
    return JSON.parse(json);
}

// Запуск сервера
app.listen(3000, () => {
    console.log('🚀 Server started on http://localhost:3000');
});