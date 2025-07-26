import Airtable from "airtable"

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
)

export const getAirtableRecords = async (tableName: string) => {
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
          if (err) reject(err)
          else resolve(records)
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
    attachment?: any; // Airtable attachments are objects with url, filename, etc.
  };
}

// Fetch all snaps from the "snaps" table
export const fetchUserSnaps = async (): Promise<Snap[]> => {
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
            if (err) reject(err)
            else resolve(records)
          }
        )
    })
  } catch (error) {
    console.error('Error fetching snaps by user:', error);
    return [];
  }
}