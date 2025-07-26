} catch (error) {
  console.error('Detailed error:', error)
  return NextResponse.json(
    { 
      error: 'Failed to fetch team data',
      details: error.message,
      baseId: AIRTABLE_BASE_ID ? 'Set' : 'Missing',
      token: AIRTABLE_ACCESS_TOKEN ? 'Set' : 'Missing'
    },
    { status: 500 }
  )
}