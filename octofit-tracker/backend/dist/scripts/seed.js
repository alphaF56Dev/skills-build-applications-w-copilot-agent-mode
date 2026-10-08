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
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        const teamData = [
            { name: 'Octocats', points: 800 },
            { name: 'Code Runners', points: 750 },
            { name: 'Trail Blazers', points: 715 },
        ];
        const teams = new Map();
        for (const data of teamData) {
            const savedTeam = await Team.findOneAndUpdate({ name: data.name }, { $set: { points: data.points } }, { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true });
            teams.set(data.name, savedTeam);
        }
        const userData = [
            { name: 'Mona Chen', email: 'mona@example.com', teamName: 'Octocats', points: 245, weeklyPoints: 85 },
            { name: 'Ada Brooks', email: 'ada@example.com', teamName: 'Octocats', points: 210, weeklyPoints: 72 },
            { name: 'Sophie Laurent', email: 'sophie@example.com', teamName: 'Octocats', points: 185, weeklyPoints: 64 },
            { name: 'Amir Patel', email: 'amir@example.com', teamName: 'Octocats', points: 160, weeklyPoints: 58 },
            { name: 'Grace Kim', email: 'grace@example.com', teamName: 'Code Runners', points: 230, weeklyPoints: 90 },
            { name: 'Linus Okafor', email: 'linus@example.com', teamName: 'Code Runners', points: 195, weeklyPoints: 68 },
            { name: 'Elena Rossi', email: 'elena@example.com', teamName: 'Code Runners', points: 175, weeklyPoints: 61 },
            { name: 'Noah Wilson', email: 'noah@example.com', teamName: 'Code Runners', points: 150, weeklyPoints: 52 },
            { name: 'Priya Shah', email: 'priya@example.com', teamName: 'Trail Blazers', points: 220, weeklyPoints: 78 },
            { name: 'Mateo Garcia', email: 'mateo@example.com', teamName: 'Trail Blazers', points: 190, weeklyPoints: 70 },
            { name: 'Zoe Martin', email: 'zoe@example.com', teamName: 'Trail Blazers', points: 165, weeklyPoints: 56 },
            { name: 'Ethan Brooks', email: 'ethan@example.com', teamName: 'Trail Blazers', points: 140, weeklyPoints: 48 },
        ];
        const users = new Map();
        for (const data of userData) {
            const savedUser = await User.findOneAndUpdate({ email: data.email }, { $set: { name: data.name, team: teams.get(data.teamName)?._id, points: data.points } }, { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true });
            users.set(data.email, savedUser);
        }
        for (const [teamName, memberEmails] of [
            ['Octocats', ['mona@example.com', 'ada@example.com', 'sophie@example.com', 'amir@example.com']],
            ['Code Runners', ['grace@example.com', 'linus@example.com', 'elena@example.com', 'noah@example.com']],
            ['Trail Blazers', ['priya@example.com', 'mateo@example.com', 'zoe@example.com', 'ethan@example.com']],
        ]) {
            await Team.updateOne({ name: teamName }, { $set: { members: memberEmails.map((email) => users.get(email)?._id) } });
        }
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const legacyActivityData = [
            { email: 'mona@example.com', type: 'running', durationMinutes: 35, distanceKm: 5.2, daysAgo: 0 },
            { email: 'mona@example.com', type: 'cycling', durationMinutes: 45, distanceKm: 12, daysAgo: 2 },
            { email: 'ada@example.com', type: 'strength training', durationMinutes: 40, daysAgo: 1 },
            { email: 'grace@example.com', type: 'running', durationMinutes: 28, distanceKm: 4.1, daysAgo: 0 },
            { email: 'linus@example.com', type: 'hiking', durationMinutes: 90, distanceKm: 6.5, daysAgo: 3 },
        ];
        for (const data of legacyActivityData) {
            const legacyDate = new Date(today);
            legacyDate.setUTCDate(legacyDate.getUTCDate() - data.daysAgo);
            const nextDate = new Date(legacyDate);
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);
            await Activity.deleteOne({
                user: users.get(data.email)?._id,
                type: data.type,
                durationMinutes: data.durationMinutes,
                ...(data.distanceKm === undefined
                    ? { distanceKm: { $exists: false } }
                    : { distanceKm: data.distanceKm }),
                completedAt: { $gte: legacyDate, $lt: nextDate },
            });
        }
        const activityData = [
            { email: 'mona@example.com', type: 'running', durationMinutes: 38, distanceKm: 5.4, daysAgo: 0, hour: 7 },
            { email: 'mona@example.com', type: 'strength training', durationMinutes: 42, daysAgo: 2, hour: 18 },
            { email: 'mona@example.com', type: 'cycling', durationMinutes: 55, distanceKm: 18.2, daysAgo: 5, hour: 9 },
            { email: 'ada@example.com', type: 'yoga', durationMinutes: 35, daysAgo: 1, hour: 6 },
            { email: 'ada@example.com', type: 'running', durationMinutes: 31, distanceKm: 4.3, daysAgo: 3, hour: 7 },
            { email: 'ada@example.com', type: 'strength training', durationMinutes: 46, daysAgo: 6, hour: 17 },
            { email: 'sophie@example.com', type: 'swimming', durationMinutes: 40, distanceKm: 1.5, daysAgo: 0, hour: 8 },
            { email: 'sophie@example.com', type: 'running', durationMinutes: 44, distanceKm: 6.1, daysAgo: 4, hour: 7 },
            { email: 'sophie@example.com', type: 'yoga', durationMinutes: 30, daysAgo: 8, hour: 18 },
            { email: 'amir@example.com', type: 'strength training', durationMinutes: 50, daysAgo: 1, hour: 17 },
            { email: 'amir@example.com', type: 'walking', durationMinutes: 36, distanceKm: 2.8, daysAgo: 4, hour: 12 },
            { email: 'amir@example.com', type: 'cycling', durationMinutes: 48, distanceKm: 15.6, daysAgo: 9, hour: 9 },
            { email: 'grace@example.com', type: 'running', durationMinutes: 33, distanceKm: 5.1, daysAgo: 0, hour: 6 },
            { email: 'grace@example.com', type: 'strength training', durationMinutes: 45, daysAgo: 2, hour: 18 },
            { email: 'grace@example.com', type: 'running', durationMinutes: 52, distanceKm: 8.2, daysAgo: 5, hour: 7 },
            { email: 'linus@example.com', type: 'hiking', durationMinutes: 112, distanceKm: 7.4, daysAgo: 1, hour: 9 },
            { email: 'linus@example.com', type: 'cycling', durationMinutes: 60, distanceKm: 20.5, daysAgo: 5, hour: 8 },
            { email: 'linus@example.com', type: 'walking', durationMinutes: 28, distanceKm: 2.1, daysAgo: 10, hour: 12 },
            { email: 'elena@example.com', type: 'pilates', durationMinutes: 45, daysAgo: 0, hour: 17 },
            { email: 'elena@example.com', type: 'running', durationMinutes: 36, distanceKm: 4.8, daysAgo: 3, hour: 7 },
            { email: 'elena@example.com', type: 'swimming', durationMinutes: 38, distanceKm: 1.4, daysAgo: 7, hour: 8 },
            { email: 'noah@example.com', type: 'basketball', durationMinutes: 58, daysAgo: 2, hour: 18 },
            { email: 'noah@example.com', type: 'strength training', durationMinutes: 40, daysAgo: 6, hour: 17 },
            { email: 'noah@example.com', type: 'running', durationMinutes: 27, distanceKm: 3.6, daysAgo: 11, hour: 7 },
            { email: 'priya@example.com', type: 'hiking', durationMinutes: 135, distanceKm: 9.8, daysAgo: 0, hour: 8 },
            { email: 'priya@example.com', type: 'yoga', durationMinutes: 32, daysAgo: 3, hour: 6 },
            { email: 'priya@example.com', type: 'running', durationMinutes: 47, distanceKm: 6.7, daysAgo: 7, hour: 7 },
            { email: 'mateo@example.com', type: 'cycling', durationMinutes: 72, distanceKm: 25.4, daysAgo: 1, hour: 9 },
            { email: 'mateo@example.com', type: 'strength training', durationMinutes: 48, daysAgo: 4, hour: 18 },
            { email: 'mateo@example.com', type: 'hiking', durationMinutes: 98, distanceKm: 6.2, daysAgo: 9, hour: 8 },
            { email: 'zoe@example.com', type: 'running', durationMinutes: 29, distanceKm: 3.9, daysAgo: 2, hour: 7 },
            { email: 'zoe@example.com', type: 'swimming', durationMinutes: 42, distanceKm: 1.6, daysAgo: 5, hour: 8 },
            { email: 'zoe@example.com', type: 'yoga', durationMinutes: 36, daysAgo: 12, hour: 18 },
            { email: 'ethan@example.com', type: 'walking', durationMinutes: 46, distanceKm: 3.5, daysAgo: 1, hour: 12 },
            { email: 'ethan@example.com', type: 'strength training', durationMinutes: 38, daysAgo: 6, hour: 17 },
            { email: 'ethan@example.com', type: 'running', durationMinutes: 34, distanceKm: 4.6, daysAgo: 13, hour: 7 },
        ];
        for (const data of activityData) {
            const completedAt = new Date(today);
            completedAt.setUTCDate(completedAt.getUTCDate() - data.daysAgo);
            completedAt.setUTCHours(data.hour, 0, 0, 0);
            await Activity.findOneAndUpdate({ user: users.get(data.email)?._id, type: data.type, completedAt }, {
                $set: {
                    durationMinutes: data.durationMinutes,
                    distanceKm: data.distanceKm,
                },
            }, { upsert: true, setDefaultsOnInsert: true });
        }
        for (const period of ['all-time', 'weekly']) {
            for (const [rank, data] of userData
                .map((entry) => ({ ...entry, team: teams.get(entry.teamName) }))
                .sort((first, second) => second[period === 'all-time' ? 'points' : 'weeklyPoints'] -
                first[period === 'all-time' ? 'points' : 'weeklyPoints'])
                .entries()) {
                await Leaderboard.findOneAndUpdate({ user: users.get(data.email)?._id, team: data.team?._id, period }, {
                    $set: {
                        points: data[period === 'all-time' ? 'points' : 'weeklyPoints'],
                        rank: rank + 1,
                    },
                }, { upsert: true, setDefaultsOnInsert: true });
            }
        }
        const workoutData = [
            {
                name: 'Interval Run',
                description: 'Build aerobic fitness with six controlled efforts and easy recovery jogs.',
                difficulty: 'beginner',
                durationMinutes: 30,
                activities: ['5-minute brisk walk', '6 x 2-minute steady run', '1-minute recovery jogs', '5-minute cool-down'],
            },
            {
                name: 'Full-body Strength',
                description: 'A balanced resistance session using fundamental movements and controlled form.',
                difficulty: 'intermediate',
                durationMinutes: 45,
                activities: ['goblet squats', 'dumbbell rows', 'push-ups', 'reverse lunges', 'dead bugs'],
            },
            {
                name: 'Easy Recovery Ride',
                description: 'A conversational-pace ride designed to keep the legs moving without hard efforts.',
                difficulty: 'beginner',
                durationMinutes: 35,
                activities: ['5-minute easy spin', '25-minute steady cycling', '5-minute cool-down'],
            },
            {
                name: 'Mobility and Yoga Flow',
                description: 'A gentle sequence to improve mobility, balance, and recovery after training.',
                difficulty: 'beginner',
                durationMinutes: 30,
                activities: ['cat-cow stretches', 'low lunge', 'downward dog', 'standing balance', 'breathing'],
            },
            {
                name: 'Tempo Run',
                description: 'Improve sustained running pace with a comfortably hard tempo block.',
                difficulty: 'intermediate',
                durationMinutes: 42,
                activities: ['10-minute easy warm-up', '20-minute tempo effort', '12-minute easy cool-down'],
            },
            {
                name: 'Endurance Cycling',
                description: 'Develop aerobic endurance with a steady, moderate-effort ride.',
                difficulty: 'intermediate',
                durationMinutes: 60,
                activities: ['10-minute warm-up', '40-minute steady ride', '10-minute cool-down'],
            },
            {
                name: 'Trail Hike',
                description: 'A moderate outdoor hike with a gradual climb and a relaxed return.',
                difficulty: 'intermediate',
                durationMinutes: 75,
                activities: ['10-minute easy start', '50-minute trail climb and traverse', '15-minute descent'],
            },
            {
                name: 'Cycling Hill Repeats',
                description: 'Build cycling power through short uphill efforts with full recovery between repeats.',
                difficulty: 'advanced',
                durationMinutes: 50,
                activities: ['10-minute warm-up', '5 x 3-minute hill effort', '3-minute easy recovery', '10-minute cool-down'],
            },
        ];
        await Workout.deleteMany({ name: { $in: ['Strength and Stability', 'Recovery Ride'] } });
        for (const data of workoutData) {
            await Workout.findOneAndUpdate({ name: data.name }, { $set: data }, { upsert: true, setDefaultsOnInsert: true });
        }
        console.log('Database seeding complete');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    }
    finally {
        await mongoose.disconnect();
    }
}
seedDatabase();
