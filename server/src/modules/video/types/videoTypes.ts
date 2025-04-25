export interface PauseSegment {
  start: number;
  end: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface WhisperVerboseResponse {
  text: string;
  segments: TranscriptSegment[];
  language: string;
}
