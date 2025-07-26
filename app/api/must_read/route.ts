import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    // Get visible must reads sorted by timestamp (most recent first)
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Must%20Read?filterByFormula={Visibility}=TRUE()&sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=10`,
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
      title: record.fields.Title || 'Untitled Article',
      link: record.fields.Link || '',
      source: record.fields.Source || 'Unknown Source',
      summary: record.fields.Summary || '',
      tags: Array.isArray(record.fields.Tags) 
        ? record.fields.Tags 
        : record.fields.Tags 
          ? [record.fields.Tags] 
          : [],
      submittedBy: record.fields['Submitted By'] || 'Anonymous',
      category: record.fields.Tags?.[0] || 'General',
      author: record.fields.Source || 'Unknown',
      timestamp: formatTimestamp(record.fields.Timestamp),
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching must reads data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch must reads data' },
      { status: 500 }
    )
  }
}

function formatTimestamp(dateString: string): string {
  if (!dateString) return 'Recently'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}