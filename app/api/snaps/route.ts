import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    // Get visible recordings sorted by date (most recent first)
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Meeting Recordings?filterByFormula={Visibility}=TRUE()&sort[0][field]=Date&sort[0][direction]=desc&maxRecords=5`,
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
      title: record.fields.Title || 'Untitled Meeting',
      date: record.fields.Date || '',
      type: record.fields.Type || 'Meeting',
      recordingLink: record.fields['Recording Link'] || '',
      password: record.fields.Password || '',
      summary: record.fields.Summary || '',
      duration: calculateDuration(record.fields.Date), // You might want to add a duration field
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching recordings data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recordings data' },
      { status: 500 }
    )
  }
}

function calculateDuration(dateString: string): string {
  // This is a placeholder - you might want to add an actual duration field
  return '45 min'
}