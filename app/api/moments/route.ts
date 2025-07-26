import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    // Get moments marked for homepage, sorted by date
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Moments?filterByFormula={Homepage}=TRUE()&sort[0][field]=Date&sort[0][direction]=asc&maxRecords=10`,
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
    
    const transformedRecords = data.records.map((record: any) => ({
      id: record.id,
      title: record.fields.Title || 'Untitled Event',
      date: new Date(record.fields.Date || Date.now()),
      time: record.fields.Time || 'All Day',
      type: record.fields.Type || 'Event',
      recordingLink: record.fields['Recording Link'] || '',
      team: Array.isArray(record.fields.Team) 
        ? record.fields.Team 
        : record.fields.Team 
          ? [record.fields.Team] 
          : [],
      client: record.fields.Client || '',
      notes: record.fields.Notes || '',
      attendees: Array.isArray(record.fields.Team) 
        ? record.fields.Team 
        : record.fields.Team 
          ? [record.fields.Team] 
          : [],
      color: getEventColor(record.fields.Type),
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching moments data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moments data' },
      { status: 500 }
    )
  }
}

function getEventColor(type: string): string {
  switch (type?.toLowerCase()) {
    case 'meeting':
      return 'bg-blue-500'
    case 'deadline':
    case 'due date':
      return 'bg-orange-500'
    case 'pto':
    case 'vacation':
      return 'bg-purple-500'
    case 'holiday':
      return 'bg-red-500'
    case 'office event':
    case 'team event':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}