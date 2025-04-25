import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { API_KEYS } from '../config/apiKeys';

const baseUrl = 'https://api.gmini.example.com'; // гипотетический URL

export const handleGminiText = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    `${baseUrl}/chat`,
    { prompt },
    {
      headers: { Authorization: `Bearer ${API_KEYS.gmini}` },
    },
  );
  return response.data.response || response.data;
};

export const handleGminiAudio = async (audioPath: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioPath));

  const response = await axios.post(`${baseUrl}/transcribe`, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${API_KEYS.gmini}`,
    },
  });
  return response.data;
};
