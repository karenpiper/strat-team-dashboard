import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Pipeline`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to match what your app expects
    const transformedRecords = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Name || 'Untitled Project',
      type: record.fields.Type || 'Project',
      description: record.fields.Description || '',
      dueDate: formatDate(record.fields['Due Date']),
      lead: record.fields.Lead || 'Unassigned',
      owner: Array.isArray(record.fields.Team) 
        ? record.fields.Team 
        : record.fields.Team 
          ? [record.fields.Team] 
          : [record.fields.Lead || 'Unassigned'],
      status: record.fields.Status || 'Not Started',
      statusColor: getStatusColor(record.fields.Status),
      progress: calculateProgress(record.fields.Status),
      notes: record.fields.Notes || '',
      url: record.fields.URL || '',
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching pipeline data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline data' },
      { status: 500 }
    )
  }
}

function calculateProgress(status: string): number {
  // Calculate progress based on status since you don't have a progress field
  switch (status?.toLowerCase()) {
    case 'not started':
      return 0
    case 'in progress':
    case 'active':
      return 65
    case 'review':
    case 'pending':
      return 85
    case 'completed':
    case 'done':
      return 100
    default:
      return 50
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return 'No due date'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'in progress':
    case 'active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'review':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed':
    case 'done':
    case 'final draft':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'blocked':
    case 'on hold':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}