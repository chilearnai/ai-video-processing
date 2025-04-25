import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import {
  cleanupFiles,
  detectLongPauses,
  extractAudioFromVideo,
  removePausesFromVideo,
  transcribeWithTimestamps,
} from '../utils/videoModificatorHelpers';
import { PauseSegment } from '../types/videoTypes';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Controller for processing the video
export const processVideo = [
  upload.single('video'),
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File | undefined;

    // Check if file was uploaded
    if (!file) {
      res.status(400).send('The file was not uploaded.');
      return;
    }

    // Define paths for video, audio, and output files
    const videoPath = file.path;
    const audioPath = `${videoPath}.wav`;
    const outputPath = `outputs/${path.basename(videoPath)}_cut.mp4`;

    try {
      // Extract audio from the video file
      await extractAudioFromVideo(videoPath, audioPath);

      // Transcribe audio with timestamps
      const transcript: any = await transcribeWithTimestamps(audioPath);

      // Detect long pauses in the transcript
      const pauses: PauseSegment[] = await detectLongPauses(transcript);

      // Remove pauses from the video using the detected pause segments
      await removePausesFromVideo(videoPath, pauses, outputPath);

      // Send the processed video back to the client
      res.download(outputPath);
    } catch (error) {
      // Log any error that occurs during the process
      console.error('Error while processing video:', error);
      res.status(500).send('Error while processing video');
    } finally {
      // Clean up temporary files (video and audio)
      await cleanupFiles([videoPath, audioPath]);
    }
  },
];
