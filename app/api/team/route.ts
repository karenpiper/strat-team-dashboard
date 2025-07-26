import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Team`,
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
      fields: {
        Name: record.fields.Name || '',
        Role: record.fields.Role || '',
        Discipline: record.fields.Discipline || '',
        Email: record.fields.Email || '',
        Manager: record.fields.Manager || '',
        // Handle photo attachment - get the first photo URL if it exists
        "Photo URL": record.fields.Photo?.[0]?.url || '',
        Birthday: record.fields.Birthday || '',
        Featured: record.fields.Featured || false,
        "Code-a-scope": record.fields["Code-a-scope"] || '',
        // Add computed fields that your app expects
        "Snaps Count": 0, // You'll calculate this from the Snaps table
        "Featured Count": record.fields.Featured ? 1 : 0,
      }
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
  console.error('Error fetching team data:', error)
  return NextResponse.json(
    { error: 'Failed to fetch team data' },
    { status: 500 }
  )
}
}