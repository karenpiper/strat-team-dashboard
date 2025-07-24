import { NextResponse } from "next/server"

// Mock data for development and when API keys are not provided
const mockTeamData = [
  {
    id: "rec1",
    fields: {
      Name: "John Doe",
      Role: "Lead Strategist",
      Email: "john.doe@example.com",
      Password: "password123",
      "Profile Picture": [{ url: "/placeholder.svg?height=40&width=40" }],
    },
  },
  {
    id: "rec2",
    fields: {
      Name: "Jane Smith",
      Role: "Senior Analyst",
      Email: "jane.smith@example.com",
      Password: "password123",
      "Profile Picture": [{ url: "/placeholder.svg?height=40&width=40" }],
    },
  },
  {
    id: "rec3",
    fields: {
      Name: "Karen",
      Role: "Project Manager",
      Email: "karen@example.com",
      Password: "password123",
      "Profile Picture": [{ url: "/placeholder.svg?height=40&width=40" }],
    },
  },
]

export async function GET(request: Request) {
  try {
    console.log("API route called")

    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    // Always use mock data in development or when API keys are not properly configured
    const shouldUseMockData =
      process.env.NODE_ENV !== "production" ||
      !airtableApiKey ||
      !airtableBaseId ||
      airtableApiKey === "your_airtable_api_key_here" ||
      airtableBaseId === "your_airtable_base_id_here"

    if (shouldUseMockData) {
      console.log("Using mock team data")
      return NextResponse.json(mockTeamData)
    }

    // Production mode with real Airtable
    console.log("Attempting to fetch from Airtable")
    const url = `https://api.airtable.com/v0/${airtableBaseId}/Team`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`Airtable API error: ${response.status}`)
      // Fallback to mock data on API error
      return NextResponse.json(mockTeamData)
    }

    const data = await response.json()
    return NextResponse.json(data.records || [])
  } catch (error) {
    console.error("Error in team API route:", error)
    // Always return JSON, never let it fall through to HTML error pages
    return NextResponse.json(mockTeamData)
  }
}
