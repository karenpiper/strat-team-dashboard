import { NextResponse } from "next/server"

const mockRecordingsData = [
  {
    id: "recording1",
    fields: {
      Title: "Weekly Strategy Sync",
      Date: "2024-01-18T10:00:00.000Z",
      Duration: "45 minutes",
      Description: "Team alignment on Q1 priorities, Nike campaign review, and new business pipeline discussion.",
      URL: "#",
    },
  },
]

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(mockRecordingsData)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/MeetingRecordings`, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.records || [])
  } catch (error) {
    console.error("Meeting Recordings API Error:", error)
    return NextResponse.json(mockRecordingsData)
  }
}
