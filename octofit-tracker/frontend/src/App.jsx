import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navigation = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/activities">
            OctoFit Tracker
          </NavLink>
          <nav aria-label="Main navigation" className="navbar-nav flex-row flex-wrap gap-2">
            {navigation.map(({ label, path }) => (
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3${isActive ? ' active' : ''}`
                }
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-4 py-md-5">
        <Routes>
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route
            path="*"
            element={
              <div className="alert alert-warning" role="alert">
                That page could not be found.
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="container pb-4 small text-secondary">
        OctoFit Tracker
      </footer>
    </div>
  )
}

export default App
