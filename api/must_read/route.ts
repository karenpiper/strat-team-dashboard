import { NextResponse } from "next/server"

const mockMustReadData = [
  {
    id: "read1",
    fields: {
      Title: "The Strategy Playbook",
      Description: "Our comprehensive guide to strategic thinking, client management, and creative problem-solving.",
      URL: "#",
      Category: "Team Staples",
    },
  },
  {
    id: "read2",
    fields: {
      Title: "Brand Voice Guidelines",
      Description: "How we communicate across all touchpoints - from client presentations to social media.",
      URL: "#",
      Category: "Team Staples",
    },
  },
]

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(mockMustReadData)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/MustRead`, {
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
    console.error("Must Read API Error:", error)
    return NextResponse.json(mockMustReadData)
  }
}
