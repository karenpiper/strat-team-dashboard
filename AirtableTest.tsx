"use client"

import { useEffect, useState } from "react"

export default function AirtableTest() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}/TeamDashboard`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
        }

        const json = await res.json()
        setData(json.records)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchData()
  }, [])

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!data) return <div>Loading data from Airtable...</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Airtable Data:</h2>
      <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto max-h-[400px]">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
