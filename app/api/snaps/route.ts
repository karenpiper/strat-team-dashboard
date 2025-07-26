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
      Image: "https://placehold.co/600x400?text=Snap+1",
    },
  },
  {
    id: "snap2",
    fields: {
      Quote: "The way you handled that difficult stakeholder conversation was masterful. Great leadership!",
      Author: "Mike Rodriguez",
      Date: "2024-01-15T15:30:00.000Z",
      Target: "Sarah Chen",
      Image: "https://placehold.co/600x400?text=Snap+2",
    },
  },
  {
    id: "snap3",
    fields: {
      Quote: "Your data visualization skills made our quarterly report so much more impactful. The client loved it!",
      Author: "Jamie Lee",
      Date: "2024-01-20T09:15:00.000Z",
      Target: "Alex Johnson",
      Image: "https://placehold.co/600x400?text=Snap+3",
    },
  },
]

// Helper: get random items from an array
export async function GET() {
  const fallbackSnaps = getRandomItems(mockSnapsData, Math.floor(Math.random() * 2) + 2)
  return NextResponse.json(fallbackSnaps)
}
