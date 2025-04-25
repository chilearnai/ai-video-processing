import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для транскрипта
export interface ITranscript extends Document {
  text: string;
  timestamps: number[];
  speaker: string;
  language: string;
  createdAt: Date;
}
const TranscriptSchema: Schema = new Schema({
  text: { type: String, required: true },
  timestamps: [{ type: Number, required: true }],
  speaker: { type: String, required: true },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
});

const Transcript = mongoose.model<ITranscript>('Transcript', TranscriptSchema);

export default Transcript;
