import CollectionPage from './CollectionPage.jsx'

const columns = [
  { label: 'Workout', render: (workout) => workout.name ?? '—' },
  { label: 'Description', render: (workout) => workout.description ?? '—' },
  { label: 'Difficulty', render: (workout) => workout.difficulty ?? '—' },
  {
    label: 'Duration',
    render: (workout) =>
      workout.durationMinutes == null ? '—' : `${workout.durationMinutes} min`,
  },
  {
    label: 'Activities',
    render: (workout) =>
      Array.isArray(workout.activities) ? workout.activities.join(', ') : '—',
  },
]

function Workouts() {
  return (
    <CollectionPage
      columns={columns}
      description="Find a workout and review the activities it includes."
      endpoint="/api/workouts/"
      title="Workouts"
    />
  )
}

export default Workouts
