# OctoFit Tracker presentation tier

The React 19 and Vite application reads activities, leaderboard entries, teams,
users, and workouts from the backend API on port 8000.

## API configuration

When running in a GitHub Codespace, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local` using your Codespace name:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this value through `import.meta.env`. Restart the Vite development
server after changing the file. When `VITE_CODESPACE_NAME` is unset, the
presentation tier safely uses `http://localhost:8000` for local development.

## Development

Install dependencies and start the Vite server from the repository root:

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```
