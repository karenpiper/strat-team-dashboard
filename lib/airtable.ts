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
