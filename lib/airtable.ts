const baseId = process.env.AIRTABLE_BASE_ID;
const accessToken = process.env.AIRTABLE_ACCESS_TOKEN;

if (!baseId) console.error("Missing AIRTABLE_BASE_ID");
if (!accessToken) console.error("Missing AIRTABLE_ACCESS_TOKEN");

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

export const fetchUserSnaps = async (): Promise<Snap[]> => {
  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/snaps`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Airtable API error:", await res.text());
      return [];
    }

    const data = await res.json();
    return data.records as Snap[];
  } catch (err) {
    console.error("Failed to fetch snaps:", err);
    return [];
  }
};

export const fetchSnapsByUser = async (submittedBy: string): Promise<Snap[]> => {
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/snaps?filterByFormula=${encodeURIComponent(`{submitted by} = "${submittedBy}"`)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Airtable API error:", await res.text());
      return [];
    }

    const data = await res.json();
    return data.records as Snap[];
  } catch (err) {
    console.error("Failed to fetch filtered snaps:", err);
    return [];
  }
};
