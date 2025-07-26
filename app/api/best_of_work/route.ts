import { NextResponse } from 'next/server'

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Best%20of%20Work?sort[0][field]=Date Added&sort[0][direction]=desc&maxRecords=6`,
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
      title: record.fields['Project Name'] || 'Untitled Project',
      client: record.fields.Client || 'Internal',
      description: record.fields.Description || '',
      owner: record.fields['Main Owner'] || 'Team',
      team: record.fields['Main Owner'] ? [record.fields['Main Owner']] : ['Team'],
      link: record.fields.Link || '',
      type: record.fields.Type || 'Project',
      typeColor: getTypeColor(record.fields.Type),
      date: formatDate(record.fields['Date Added']),
      thumbnail: record.fields.Thumbnail?.[0]?.url || '',
      icon: getTypeIcon(record.fields.Type),
    }))

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error('Error fetching best of work data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch best of work data' },
      { status: 500 }
    )
  }
}

function getTypeColor(type: string): string {
  switch (type?.toLowerCase()) {
    case 'research':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'strategy':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'analysis':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'design':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    case 'presentation':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getTypeIcon(type: string): string {
  // Return the icon name that matches your lucide-react imports
  switch (type?.toLowerCase()) {
    case 'research':
      return 'BarChart3'
    case 'strategy':
      return 'Target'
    case 'analysis':
      return 'TrendingUp'
    case 'design':
      return 'Palette'
    case 'presentation':
      return 'FileText'
    default:
      return 'Briefcase'
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Recent'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}