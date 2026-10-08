export function referenceName(value) {
  if (value == null || value === '') {
    return '—'
  }

  if (typeof value === 'object') {
    return value.name ?? value.email ?? value._id ?? '—'
  }

  return value
}

export function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}
