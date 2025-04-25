import React, { useEffect, useRef, useState } from 'react';
import styles from './Home.module.scss';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const canvas = document.createElement('canvas');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoURL(url);
    }
  };

  const extractFrames = async (interval = 1) => {
    const video = videoRef.current;
    if (!video) return;

    const framesList: string[] = [];
    const ctx = canvas.getContext('2d');

    for (let time = startTime; time <= endTime; time += interval) {
      await new Promise<void>((resolve) => {
        video.currentTime = time;
        video.onseeked = () => {
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            framesList.push(canvas.toDataURL('image/png'));
          }
          resolve();
        };
      });
    }
    setFrames(framesList);
  };

  useEffect(() => {
    if (videoRef.current) {
      if ('onloadedmetadata' in videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          setDuration(videoRef.current!.duration);
          setEndTime(videoRef.current!.duration);
        };
      }
    }
  }, [videoURL]);

  const handleCut = () => {
    alert(`cut from ${startTime.toFixed(1)} sec to ${endTime.toFixed(1)} sec`);
  };

  return (
    <div className={styles.editor}>
      <h1 className={styles.editor__title}>🎞 Видео фрейм-редактор</h1>

      <input
        type="file"
        accept="video/*"
        className={styles.uploadButton}
        onChange={handleUpload}
      />

      {videoURL && (
        <div className={styles['video-controls']}>
          <video
            ref={videoRef}
            src={videoURL}
            controls
            className={styles['video-controls__video--hidden']}
          />

          <button className={styles.button} onClick={() => extractFrames(1)}>
            "Break it down frame by frame (every 1 second)"
          </button>

          <div className={styles.frames}>
            {frames.map((frame, index) => (
              <img
                key={index}
                src={frame}
                alt={`frame-${index}`}
                className={styles.frames__item}
                width={160}
                height={90}
              />
            ))}
          </div>

          <div className={styles['range-controls']}>
            <div className={styles['range-controls__group']}>
              <label className={styles['range-controls__label']}>Старт:</label>
              <input
                type="range"
                className={styles['range-controls__range']}
                min={0}
                max={duration}
                step={0.1}
                value={startTime}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
              />
              <span className={styles['range-controls__value']}>
                {startTime.toFixed(1)} сек
              </span>
            </div>

            <div className={styles['range-controls__group']}>
              <label className={styles['range-controls__label']}>End:</label>
              <input
                type="range"
                className={styles['range-controls__range']}
                min={0}
                max={duration}
                step={0.1}
                value={endTime}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
              />
              <span className={styles['range-controls__value']}>
                {endTime.toFixed(1)} sec
              </span>
            </div>

            <button
              className={`${styles.button} ${styles['button--cut']}`}
              onClick={handleCut}
            >
              Cut
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
