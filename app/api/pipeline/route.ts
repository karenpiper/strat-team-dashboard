import { NextResponse } from "next/server"

// Mock data for business pipeline
const mockPipelineData = [
  {
    id: "pipeline1",
    name: "TechCorp Rebranding",
    dueDate: "Mar 25",
    owner: ["Karen J.", "Mike C."],
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    progress: 65,
  },
  {
    id: "pipeline2",
    name: "FinanceApp Strategy",
    dueDate: "Mar 30",
    owner: ["John D."],
    status: "Review",
    statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    progress: 85,
  },
  {
    id: "pipeline3",
    name: "Healthcare Market Analysis",
    dueDate: "Apr 5",
    owner: ["Jane S.", "Alex R."],
    status: "Final Draft",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    progress: 95,
  },
  {
    id: "pipeline4",
    name: "Retail Expansion Plan",
    dueDate: "Apr 10",
    owner: ["Sarah M.", "Karen J."],
    status: "Planning",
    statusColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    progress: 30,
  },
  {
    id: "pipeline5",
    name: "Social Media Campaign",
    dueDate: "Apr 15",
    owner: ["Mike C.", "John D."],
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    progress: 50,
  },
]

// Function to update progress randomly
function getUpdatedPipeline() {
  return mockPipelineData.map((item) => {
    // Randomly increase progress by 0-5%
    const progressIncrease = Math.floor(Math.random() * 6)
    let newProgress = item.progress + progressIncrease

    // Cap at 100%
    if (newProgress > 100) newProgress = 100

    // Update status based on progress
    let status = item.status
    let statusColor = item.statusColor

    if (newProgress >= 100) {
      status = "Complete"
      statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    } else if (newProgress >= 90) {
      status = "Final Draft"
      statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    } else if (newProgress >= 75) {
      status = "Review"
      statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    } else if (newProgress >= 25) {
      status = "In Progress"
      statusColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    } else {
      status = "Planning"
      statusColor = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }

    return {
      ...item,
      progress: newProgress,
      status,
      statusColor,
    }
  })
}

// Function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get 3 random items with updated progress
    const updatedPipeline = getUpdatedPipeline()
    const randomPipeline = getRandomItems(updatedPipeline, 3)

    return NextResponse.json(randomPipeline)
  } catch (error) {
    console.error("Pipeline API Error:", error)
    return NextResponse.json([])
  }
}
