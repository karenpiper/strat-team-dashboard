import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mentionedUser = searchParams.get('mentioned')
    
    // Build the filter formula if we want snaps about a specific user
    let filterFormula = ''
    if (mentionedUser) {
      filterFormula = `&filterByFormula={Mentioned}="${mentionedUser}"`
    }
    
    // Fetch snaps sorted by date (most recent first)
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Snaps?sort[0][field]=Date&sort[0][direction]=desc&maxRecords=10${filterFormula}`,
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
      quote: record.fields['Snap content'] || '',
      author: record.fields['Submitted by'] || 'Anonymous',
      mentioned: record.fields.Mentioned || '',
      timestamp: formatTimestamp(record.fields.Date),
      category: 'Feedback', // You can adjust this or add a Category field
      attachment: record.fields.Attachment?.[0]?.url || null,
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching snaps data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch snaps data' },
      { status: 500 }
    )
  }
}

function formatTimestamp(dateString: string): string {
  if (!dateString) return 'Unknown time'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}