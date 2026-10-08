import CollectionPage from './CollectionPage.jsx'
import { referenceName } from './formatters.js'

const columns = [
  { label: 'Rank', render: (entry) => entry.rank ?? '—' },
  { label: 'Athlete', render: (entry) => referenceName(entry.user) },
  { label: 'Team', render: (entry) => referenceName(entry.team) },
  { label: 'Points', render: (entry) => entry.points ?? 0 },
  { label: 'Period', render: (entry) => entry.period ?? '—' },
]

function Leaderboard() {
  return (
    <CollectionPage
      columns={columns}
      description="See how athletes are performing across the leaderboard."
      endpoint="/api/leaderboard/"
      title="Leaderboard"
    />
  )
}

export default Leaderboard
