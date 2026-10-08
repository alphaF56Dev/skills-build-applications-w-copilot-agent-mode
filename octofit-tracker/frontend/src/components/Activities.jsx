import CollectionPage from './CollectionPage.jsx'
import { formatDate, referenceName } from './formatters.js'

const columns = [
  { label: 'Athlete', render: (activity) => referenceName(activity.user) },
  { label: 'Activity', render: (activity) => activity.type ?? '—' },
  {
    label: 'Duration',
    render: (activity) =>
      activity.durationMinutes == null ? '—' : `${activity.durationMinutes} min`,
  },
  {
    label: 'Distance',
    render: (activity) =>
      activity.distanceKm == null ? '—' : `${activity.distanceKm} km`,
  },
  { label: 'Completed', render: (activity) => formatDate(activity.completedAt) },
]

function Activities() {
  return (
    <CollectionPage
      columns={columns}
      description="Recent training sessions logged by the community."
      endpoint="/api/activities/"
      title="Activities"
    />
  )
}

export default Activities
