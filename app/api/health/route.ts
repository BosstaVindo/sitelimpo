import { NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "2.1.0",
      environment: process.env.NODE_ENV || "development",
      memory: process.memoryUsage(),
    }

    console.log("🏥 [HEALTH] Health check requested")

    return NextResponse.json({
      success: true,
      data: healthData,
    })
  } catch (error) {
    console.error("❌ [HEALTH] Health check failed:", error)

    return NextResponse.json({ status: "error", error: "Health check failed" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
