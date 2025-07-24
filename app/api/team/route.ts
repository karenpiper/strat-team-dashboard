import { NextResponse } from "next/server"

// Mock data for team members
const mockTeamMembers = [
  {
    id: "rec1",
    fields: {
      Name: "Karen Johnson",
      Email: "karen@example.com",
      Password: "password123",
      Role: "Project Manager",
      Department: "Strategy",
      Bio: "Experienced project manager with a focus on digital transformation initiatives.",
      "Start Date": "2021-03-15",
      "Slack Handle": "@karen",
      "GitHub Handle": "karenjohnson",
      Skills: ["Project Management", "Client Relations", "Strategic Planning"],
      "Favorite Coffee": "Americano",
      "Fun Fact": "Has visited 25 countries",
      "Snaps Count": 12,
      "Featured Count": 3,
      "Photo URL": "/placeholder.svg?height=200&width=200&text=Karen+Johnson&bg=8b5cf6&color=fff",
    },
  },
  {
    id: "rec2",
    fields: {
      Name: "John Doe",
      Email: "john.doe@example.com",
      Password: "password123",
      Role: "Lead Strategist",
      Department: "Strategy",
      Bio: "Strategic thinker with 8+ years of experience in market analysis and positioning.",
      "Start Date": "2020-06-01",
      "Slack Handle": "@johnd",
      "GitHub Handle": "johndoe",
      Skills: ["Market Analysis", "Competitive Intelligence", "Brand Strategy"],
      "Favorite Coffee": "Espresso",
      "Fun Fact": "Former professional chess player",
      "Snaps Count": 8,
      "Featured Count": 2,
      "Photo URL": "/placeholder.svg?height=200&width=200&text=John+Doe&bg=3b82f6&color=fff",
    },
  },
  {
    id: "rec3",
    fields: {
      Name: "Jane Smith",
      Email: "jane.smith@example.com",
      Password: "password123",
      Role: "Senior Analyst",
      Department: "Research",
      Bio: "Data-driven analyst specializing in consumer behavior and market trends.",
      "Start Date": "2022-01-10",
      "Slack Handle": "@janes",
      "GitHub Handle": "janesmith",
      Skills: ["Data Analysis", "User Research", "Statistical Modeling"],
      "Favorite Coffee": "Cold Brew",
      "Fun Fact": "Runs a popular cooking blog",
      "Snaps Count": 5,
      "Featured Count": 1,
      "Photo URL": "/placeholder.svg?height=200&width=200&text=Jane+Smith&bg=ec4899&color=fff",
    },
  },
]

export async function GET() {
  try {
    // Check if we have environment variables for Airtable
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID

    // If we're not in production or don't have API keys, return mock data
    if (!apiKey || !baseId || process.env.NODE_ENV !== "production") {
      console.log("Using mock data for team members")
      return NextResponse.json(mockTeamMembers)
    }

    // In a real app, we would fetch from Airtable here
    // For now, just return the mock data
    return NextResponse.json(mockTeamMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}
