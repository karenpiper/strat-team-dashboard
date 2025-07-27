// app/api/auth/check/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { getAirtableTable } from "@/lib/airtable"

// Make sure the JWT secret is set
const JWT_SECRET = process.env.JWT_SECRET
const USERS_TABLE_NAME = process.env.AIRTABLE_USERS_TABLE_NAME || "Users"

export async function GET() {
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET not defined")
    return NextResponse.json(
      { success: false, error: "Server misconfiguration: JWT secret missing" },
      { status: 500 }
    )
  }

  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token found" },
        { status: 401 }
      )
    }

    // Decode token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    } catch (err) {
      console.error("❌ Invalid token:", err)
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Lookup user in Airtable
    const usersTable = getAirtableTable(USERS_TABLE_NAME)
    const user = await usersTable.find(decoded.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const { id, fields } = user
    const safeUser = {
      id,
      fields: {
        Name: fields["Name"],
        Email: fields["Email"],
        Role: fields["Role"],
        Avatar: fields["Avatar"],
      },
    }

    return NextResponse.json({ success: true, user: safeUser })
  } catch (err) {
    console.error("❌ Unexpected auth error:", err)
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    )
  }
}
