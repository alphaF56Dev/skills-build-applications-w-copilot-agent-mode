import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import { connectDatabase } from './config/database.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-tracker-backend' });
});

app.get('/api/users/', async (_req, res) => {
  res.json(await User.find().lean());
});

app.get('/api/teams/', async (_req, res) => {
  res.json(await Team.find().lean());
});

app.get('/api/activities/', async (_req, res) => {
  res.json(await Activity.find().lean());
});

app.get('/api/leaderboard/', async (_req, res) => {
  res.json(await Leaderboard.find().sort({ points: -1 }).lean());
});

app.get('/api/workouts/', async (_req, res) => {
  res.json(await Workout.find().lean());
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening at ${baseUrl}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit Tracker API:', error);
    process.exitCode = 1;
  }
}

void startServer();
