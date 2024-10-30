// app/api/query/route.js
import { NextResponse } from "next/server";
import { loadQuery, queryDatabase } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10);
    const timeRange = searchParams.get("time_range") ?? "last week";
    // Load SQL from a file
    const sql = loadQuery("getLeaderboard.sql");
    // Run the SQL query
    const data = await queryDatabase(sql, [page, limit, timeRange]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: `Database query failed: ${error}` },
      { status: 500 }
    );
  }
}
