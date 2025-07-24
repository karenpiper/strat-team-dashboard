import { NextResponse } from "next/server"

// Mock data for team moments
const mockMomentsData = [
  {
    id: "moment1",
    fields: {
      Title: "Client Strategy Review",
      Date: "2024-01-20T14:00:00.000Z",
      Type: "meeting",
      Attendees: "Sarah, Mike, Jordan",
      Description: "Quarterly strategy alignment meeting",
    },
  },
  {
    id: "moment2",
    fields: {
      Title: "Design System v2.0 Launch",
      Date: "2024-01-21T09:00:00.000Z",
      Type: "milestone",
      Attendees: "Design Team",
      Description: "Major design system update release",
    },
  },
]

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(mockMomentsData)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/Moments`, {
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
    console.error("Moments API Error:", error)
    return NextResponse.json(mockMomentsData)
  }
}
