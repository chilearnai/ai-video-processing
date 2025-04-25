import express from 'express';
import { processVideo } from './controllers/videoController';

const router = express.Router();

router.post('/process-video', processVideo);

export default router;
