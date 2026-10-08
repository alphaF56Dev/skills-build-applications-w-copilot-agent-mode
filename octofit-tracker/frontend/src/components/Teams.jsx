import CollectionPage from './CollectionPage.jsx'

const columns = [
  { label: 'Team', render: (team) => team.name ?? '—' },
  {
    label: 'Members',
    render: (team) => (Array.isArray(team.members) ? team.members.length : 0),
  },
  { label: 'Points', render: (team) => team.points ?? 0 },
]

function Teams() {
  return (
    <CollectionPage
      columns={columns}
      description="Explore teams and their community points."
      endpoint="/api/teams/"
      title="Teams"
    />
  )
}

export default Teams
