import CollectionPage from './CollectionPage.jsx'
import { referenceName } from './formatters.js'
import { fetchCollection as fetch } from '../api.js'

const endpoint = '/api/users/'

const columns = [
  { label: 'Name', render: (user) => user.name ?? '—' },
  { label: 'Email', render: (user) => user.email ?? '—' },
  { label: 'Team', render: (user) => referenceName(user.team) },
  { label: 'Points', render: (user) => user.points ?? 0 },
]

function Users() {
  return (
    <CollectionPage
      columns={columns}
      description="Meet the athletes participating in OctoFit Tracker."
      endpoint={endpoint}
      loadCollection={fetch}
      title="Users"
    />
  )
}

export default Users
