import Airtable from "airtable";

// Expect an API key, not an access token
const apiKey = process.env.AIRTABLE_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey) console.error('Missing AIRTABLE_ACCESS_TOKEN');
if (!baseId) console.error('Missing AIRTABLE_BASE_ID');

// Only initialize Airtable if we have the required credentials
let base: any = null;

if (apiKey && baseId) {
  try {
    base = new Airtable({ apiKey }).base(baseId);  // ← this must be `apiKey`
  } catch (error) {
    console.error('Failed to initialize Airtable:', error);
  }
}


export const getAirtableRecords = async (tableName: string) => {
  // Return empty array if Airtable isn't initialized
  if (!base) {
    console.warn('Airtable not initialized - check environment variables')
    return []
  }

  const records: any[] = []
  return new Promise((resolve, reject) => {
    base(tableName)
      .select({ view: "Grid view" })
      .eachPage(
        function page(partialRecords, fetchNextPage) {
          records.push(...partialRecords)
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error('Airtable error:', err)
            resolve([]) // Return empty array instead of rejecting
          } else {
            resolve(records)
          }
        }
      )
  })
}

// Interface matching your Airtable fields
export interface Snap {
  id: string;
  fields: {
    date?: string;
    "snap content"?: string;
    mentioned?: string;
    "submitted by"?: string;
    attachment?: any;
  };
}

// Fetch all snaps from the "snaps" table
export const fetchUserSnaps = async (): Promise<Snap[]> => {
  if (!base) {
    console.warn('Airtable not initialized - returning empty array')
    return []
  }

  try {
    const records = await getAirtableRecords('snaps') as Snap[];
    return records;
  } catch (error) {
    console.error('Error fetching user snaps:', error);
    return [];
  }
}

// Optional: If you need to filter by who submitted
export const fetchSnapsByUser = async (submittedBy: string): Promise<Snap[]> => {
  if (!base) {
    console.warn('Airtable not initialized - returning empty array')
    return []
  }

  try {
    const records: Snap[] = []
    return new Promise((resolve, reject) => {
      base('snaps')
        .select({
          view: "Grid view",
          filterByFormula: `{submitted by} = "${submittedBy}"`
        })
        .eachPage(
          function page(partialRecords, fetchNextPage) {
            records.push(...partialRecords as Snap[])
            fetchNextPage()
          },
          function done(err) {
            if (err) {
              console.error('Airtable filter error:', err)
              resolve([]) // Return empty array instead of rejecting
            } else {
              resolve(records)
            }
          }
        )
    })
  } catch (error) {
    console.error('Error fetching snaps by user:', error);
    return [];
  }
}