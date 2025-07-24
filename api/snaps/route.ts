import { NextResponse } from "next/server"

// Mock data for snaps
const mockSnapsData = [
  {
    id: "snap1",
    fields: {
      Quote: "Absolutely crushed the client presentation today. Your strategic thinking really shone through!",
      Author: "Sarah Chen",
      Date: "2024-01-18T10:00:00.000Z",
      Target: "Alex Johnson",
    },
  },
  {
    id: "snap2",
    fields: {
      Quote: "The way you handled that difficult stakeholder conversation was masterful. Great leadership!",
      Author: "Mike Rodriguez",
      Date: "2024-01-15T15:30:00.000Z",
      Target: "Sarah Chen",
    },
  },
  {
    id: "snap3",
    fields: {
      Quote: "Your data visualization skills made our quarterly report so much more impactful. The client loved it!",
      Author: "Jamie Lee",
      Date: "2024-01-20T09:15:00.000Z",
      Target: "Alex Johnson",
    },
  },
  {
    id: "snap4",
    fields: {
      Quote: "Thanks for stepping in to help with the emergency client request. You're a true team player!",
      Author: "Taylor Swift",
      Date: "2024-01-22T14:45:00.000Z",
      Target: "Alex Johnson",
    },
  },
  {
    id: "snap5",
    fields: {
      Quote: "The research insights you provided completely changed our approach to the campaign. Brilliant work!",
      Author: "Jordan Smith",
      Date: "2024-01-19T11:30:00.000Z",
      Target: "Alex Johnson",
    },
  },
]

// Function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function GET() {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY
    const airtableBaseId = process.env.AIRTABLE_BASE_ID

    if (!airtableApiKey || !airtableBaseId) {
      // Return random subset of mock data to simulate changing data
      const randomSnaps = getRandomItems(mockSnapsData, Math.floor(Math.random() * 2) + 2) // 2-3 items
      return NextResponse.json(randomSnaps)
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/Snaps`, {
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
    console.error("Snaps API Error:", error)
    // Return random subset of mock data to simulate changing data
    const randomSnaps = getRandomItems(mockSnapsData, Math.floor(Math.random() * 2) + 2) // 2-3 items
    return NextResponse.json(randomSnaps)
  }
}
