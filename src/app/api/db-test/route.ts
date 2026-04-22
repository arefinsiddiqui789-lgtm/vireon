import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Try a simple query to see if the DB is reachable
    const userCount = await db.user.count();
    return NextResponse.json({ 
      status: "success", 
      message: "Database is connected!", 
      userCount 
    });
  } catch (error: any) {
    console.error("DB Test Error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Database connection failed", 
      error: error.message,
      hint: "Check your DATABASE_URL in Vercel project settings."
    }, { status: 500 });
  }
}
