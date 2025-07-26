// app/api/snaps/route.ts
import { NextResponse } from 'next/server'
import { fetchUserSnaps } from '@/lib/airtable'

export async function GET() {
  try {
    const records = await fetchUserSnaps()

    const snaps = records.map(record => ({
      id: record.id,
      quote: record.fields["snap content"] || "",
      author: record.fields["submitted by"] || "Anonymous",
      mentioned: record.fields.mentioned || "",
      timestamp: record.fields.date
        ? new Date(record.fields.date).toLocaleDateString()
        : "Recently",
      category: "General"
    }))

    return NextResponse.json(snaps)
  } catch (error) {
    console.error("Error in snaps route:", error)
    return NextResponse.json({ error: 'Failed to fetch snaps' }, { status: 500 })
  }
}
