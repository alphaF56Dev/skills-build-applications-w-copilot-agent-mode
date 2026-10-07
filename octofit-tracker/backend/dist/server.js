import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import './config/database.js';
const app = express();
const port = Number(process.env.PORT) || 8000;
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-tracker-backend' });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit Tracker API listening on port ${port}`);
});
