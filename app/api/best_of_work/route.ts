import { NextResponse } from "next/server"

const mockBestOfWorkData = [
  {
    id: "work1",
    fields: {
      Title: "Nike Campaign Launch Success",
      Description:
        "Our 'Just Do It Differently' campaign for Nike's sustainability line exceeded all KPIs. 40% increase in engagement, 25% boost in brand sentiment.",
      Team: "Sarah Chen & Strategy Team",
      Date: "2024-01-15T00:00:00.000Z",
    },
  },
]

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(mockBestOfWorkData)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/BestOfWork`, {
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
    console.error("Best of Work API Error:", error)
    return NextResponse.json(mockBestOfWorkData)
  }
}
