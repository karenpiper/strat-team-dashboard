import Airtable from "airtable"

const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_ACCESS_TOKEN
const airtableBaseId = process.env.AIRTABLE_BASE_ID

if (!airtableApiKey) {
  console.warn("AIRTABLE_API_KEY is not set. Airtable integration will not work.")
}
if (!airtableBaseId) {
  console.warn("AIRTABLE_BASE_ID is not set. Airtable integration will not work.")
}

Airtable.configure({ apiKey: airtableApiKey })
const base = airtableApiKey && airtableBaseId ? Airtable.base(airtableBaseId) : null

export function getAirtableTable(tableName: string) {
  if (!base) {
    console.error(`Airtable not configured. Cannot access table: ${tableName}`)
    return {
      select: () => ({ firstPage: async () => [] }),
      find: async () => null,
      create: async () => ({ id: "mock-id", fields: {} }),
      update: async () => ({ id: "mock-id", fields: {} }),
    }
  }
  return base(tableName)
}

// ------------ Type Definitions ------------

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

// ------------ Snap Fetchers ------------

export async function fetchUserSnaps(): Promise<Snap[]> {
  try {
    const table = getAirtableTable("snaps")
    const records = await table.select({ view: "Grid view" }).firstPage()
    return records as Snap[]
  } catch (err) {
    console.error("Failed to fetch snaps:", err)
    return []
  }
}

export async function fetchSnapsByUser(submittedBy: string): Promise<Snap[]> {
  try {
    const table = getAirtableTable("snaps")
    const records = await table
      .select({
        view: "Grid view",
        filterByFormula: `{submitted by} = "${submittedBy}"`,
      })
      .firstPage()

    return records as Snap[]
  } catch (err) {
    console.error("Failed to fetch snaps by user:", err)
    return []
  }
}
