// app/api/query/route.js
import { NextResponse } from "next/server";
import { loadQuery, queryDatabase } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lookupAddress = searchParams.get("lookup_address");
    const lookupEns = searchParams.get("lookup_ens");
    if (!lookupAddress && !lookupEns)
      throw new Error("Please provide lookup_address or lookup_ens");

    // Load SQL from a file
    const sql = loadQuery("getEvents.sql");
    // Run the SQL query
    const data = await queryDatabase(sql, [lookupAddress, lookupEns]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: `Database query failed: ${error}` },
      { status: 500 }
    );
  }
}
