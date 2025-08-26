import { NextRequest, NextResponse } from "next/server"
import { cloudflare_secret } from "@/lib/media.config"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 })
    }
    
    if (!cloudflare_secret) {
      return NextResponse.json({ error: "Cloudflare secret not configured" }, { status: 500 })
    }
    
    console.log("🧪 Testing Turnstile verification...")
    console.log("🔐 Token:", token.substring(0, 20) + "...")
    console.log("🔑 Secret:", cloudflare_secret.substring(0, 20) + "...")
    
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: cloudflare_secret,
        response: token,
      }),
    })
    
    const result = await response.json()
    console.log("📡 Turnstile test result:", result)
    
    return NextResponse.json({
      success: result.success,
      result: result,
      token_preview: token.substring(0, 20) + "...",
      secret_preview: cloudflare_secret.substring(0, 20) + "..."
    })
    
  } catch (error) {
    console.error("Turnstile test error:", error)
    return NextResponse.json({ error: "Test failed", details: error }, { status: 500 })
  }
}
