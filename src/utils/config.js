import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const config = JSON.parse(fs.readFileSync('./config/server.json', 'utf8'));

export default {
  ...config,
  auth: {
    email: process.env.MICROSOFT_EMAIL,
    password: process.env.MICROSOFT_PASSWORD,
  },
};
