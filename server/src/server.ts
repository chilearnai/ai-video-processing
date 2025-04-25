import express from 'express';
import videoRoutes from './modules/video/routes';
import connectDB from "./database/connect";

const app = express();

app.use(express.json());

app.use('/api', videoRoutes);

connectDB();

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
