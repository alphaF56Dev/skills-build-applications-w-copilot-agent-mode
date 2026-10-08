import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function CollectionPage({ title, description, endpoint, columns }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const collection = await fetchCollection(endpoint, controller.signal)
        setItems(collection)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadItems()
    return () => controller.abort()
  }, [endpoint])

  return (
    <section aria-labelledby="collection-title">
      <div className="mb-4">
        <p className="text-uppercase text-primary fw-semibold small mb-2">
          OctoFit Tracker
        </p>
        <h1 className="h2 fw-bold mb-2" id="collection-title">
          {title}
        </h1>
        <p className="text-secondary mb-0">{description}</p>
      </div>

      {loading && (
        <div className="text-secondary" role="status">
          Loading {title.toLowerCase()}…
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Could not load {title.toLowerCase()}: {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="alert alert-info" role="status">
          No {title.toLowerCase()} found.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th key={column.label} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id ?? item.id ?? index}>
                  {columns.map((column) => (
                    <td key={column.label}>{column.render(item)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default CollectionPage
