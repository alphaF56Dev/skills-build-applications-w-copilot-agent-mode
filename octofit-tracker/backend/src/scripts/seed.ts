import mongoose from 'mongoose';
import 'dotenv/config';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    const teamData = [
      { name: 'Octocats', points: 340 },
      { name: 'Code Runners', points: 300 },
    ];
    const teams = new Map<string, (typeof Team.prototype)>();
    for (const data of teamData) {
      const savedTeam = await Team.findOneAndUpdate(
        { name: data.name },
        { $set: { points: data.points } },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
      );
      teams.set(data.name, savedTeam);
    }

    const userData = [
      { name: 'Mona', email: 'mona@example.com', teamName: 'Octocats', points: 180 },
      { name: 'Ada', email: 'ada@example.com', teamName: 'Octocats', points: 160 },
      { name: 'Grace', email: 'grace@example.com', teamName: 'Code Runners', points: 170 },
      { name: 'Linus', email: 'linus@example.com', teamName: 'Code Runners', points: 130 },
    ];
    const users = new Map<string, (typeof User.prototype)>();
    for (const data of userData) {
      const savedUser = await User.findOneAndUpdate(
        { email: data.email },
        { $set: { name: data.name, team: teams.get(data.teamName)?._id, points: data.points } },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
      );
      users.set(data.email, savedUser);
    }

    for (const [teamName, memberEmails] of [
      ['Octocats', ['mona@example.com', 'ada@example.com']],
      ['Code Runners', ['grace@example.com', 'linus@example.com']],
    ] as const) {
      await Team.updateOne(
        { name: teamName },
        { $set: { members: memberEmails.map((email) => users.get(email)?._id) } },
      );
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const activityData = [
      { email: 'mona@example.com', type: 'running', durationMinutes: 35, distanceKm: 5.2, daysAgo: 0 },
      { email: 'mona@example.com', type: 'cycling', durationMinutes: 45, distanceKm: 12, daysAgo: 2 },
      { email: 'ada@example.com', type: 'strength training', durationMinutes: 40, daysAgo: 1 },
      { email: 'grace@example.com', type: 'running', durationMinutes: 28, distanceKm: 4.1, daysAgo: 0 },
      { email: 'linus@example.com', type: 'hiking', durationMinutes: 90, distanceKm: 6.5, daysAgo: 3 },
    ];
    for (const data of activityData) {
      const completedAt = new Date(today);
      completedAt.setUTCDate(completedAt.getUTCDate() - data.daysAgo);
      await Activity.findOneAndUpdate(
        { user: users.get(data.email)?._id, type: data.type, completedAt },
        {
          $set: {
            durationMinutes: data.durationMinutes,
            distanceKm: data.distanceKm,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }

    for (const [rank, data] of userData
      .map((entry) => ({ ...entry, team: teams.get(entry.teamName) }))
      .sort((first, second) => second.points - first.points)
      .entries()) {
      await Leaderboard.findOneAndUpdate(
        { user: users.get(data.email)?._id, team: data.team?._id, period: 'all-time' },
        { $set: { points: data.points, rank: rank + 1 } },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }

    const workoutData = [
      {
        name: 'Interval Run',
        description: 'Build cardiovascular fitness with alternating fast and easy running intervals.',
        difficulty: 'beginner',
        durationMinutes: 30,
        activities: ['5-minute warm-up', '6 running intervals', '5-minute cool-down'],
      },
      {
        name: 'Strength and Stability',
        description: 'A full-body circuit focused on controlled strength and core stability.',
        difficulty: 'intermediate',
        durationMinutes: 40,
        activities: ['bodyweight squats', 'push-ups', 'lunges', 'plank'],
      },
      {
        name: 'Recovery Ride',
        description: 'An easy-paced ride to support active recovery and endurance.',
        difficulty: 'beginner',
        durationMinutes: 35,
        activities: ['easy cycling', 'steady cadence', 'gentle cool-down'],
      },
    ];
    for (const data of workoutData) {
      await Workout.findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
