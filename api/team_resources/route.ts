import { NextResponse } from "next/server"

const mockResourcesData = [
  {
    id: "resource1",
    fields: {
      Title: "Figma Design System",
      URL: "#",
      Category: "Design",
      Icon: "FileText",
    },
  },
  {
    id: "resource2",
    fields: {
      Title: "Brand Guidelines",
      URL: "#",
      Category: "Brand",
      Icon: "BookOpen",
    },
  },
  {
    id: "resource3",
    fields: {
      Title: "Client Portal",
      URL: "#",
      Category: "Client",
      Icon: "Users",
    },
  },
]

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(mockResourcesData)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/TeamResources`, {
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
    console.error("Team Resources API Error:", error)
    return NextResponse.json(mockResourcesData)
  }
}
