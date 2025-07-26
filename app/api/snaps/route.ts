import type { NextApiRequest, NextApiResponse } from 'next'
import Airtable from 'airtable'

const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const records: any[] = []
    
    await new Promise((resolve, reject) => {
      base('snaps')
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

    const snaps = records.map(record => ({
      id: record.id,
      quote: record.fields["snap content"] || "",
      author: record.fields["submitted by"] || "Anonymous",
      mentioned: record.fields.mentioned || "",
      timestamp: record.fields.date ? new Date(record.fields.date).toLocaleDateString() : "Recently",
      category: "General"
    }))

    res.status(200).json(snaps)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snaps' })
  }
}