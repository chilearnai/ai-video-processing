import express from 'express';
import mongoose from 'mongoose';
import videoRoutes from './modules/video/routes';

const app = express();

app.use(express.json());

app.use('/api', videoRoutes);

mongoose
  .connect('mongodb://localhost:27017/video_processing')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
