import { type NextRequest, NextResponse } from "next/server"
import { discord_webhook, cloudflare_secret } from "@/lib/media.config"

interface ContactFormData {
  name: string
  email: string
  message: string
  turnstileToken?: string | null
}

export async function POST(request: NextRequest) {
  console.log('🔔 API route called')
  
  try {
    const body: ContactFormData = await request.json()
    const { name, email, message, turnstileToken } = body
    
    console.log('📥 Received data:', { name, email, message: message?.substring(0, 50) + '...', turnstileToken: turnstileToken ? 'SET' : 'NOT SET' })
    console.log('🔧 Environment check:', {
      discord_webhook: discord_webhook ? 'SET' : 'NOT SET',
      cloudflare_secret: cloudflare_secret ? 'SET' : 'NOT SET'
    })

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Verify Cloudflare Turnstile if configured
    // Verify Cloudflare Turnstile if configured
    if (cloudflare_secret && turnstileToken) {
      try {
        console.log("🔐 Verifying Turnstile token:", turnstileToken.substring(0, 20) + "...")
        console.log("🔑 Using secret:", cloudflare_secret.substring(0, 20) + "...")
        
        const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: cloudflare_secret,
            response: turnstileToken,
          }),
        })

        const turnstileResult = await turnstileResponse.json()
        console.log("📡 Turnstile API response:", turnstileResult)
        
        if (!turnstileResult.success) {
          console.log("❌ Turnstile verification failed:", turnstileResult)
          return NextResponse.json({ 
            error: "Captcha verification failed", 
            details: turnstileResult 
          }, { status: 400 })
        }
        
        console.log("✅ Turnstile verification successful")
      } catch (error) {
        console.error("❌ Turnstile verification error:", error)
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 })
      }
    } else if (cloudflare_secret && !turnstileToken) {
      console.log("❌ Turnstile token missing but required")
      return NextResponse.json({ error: "Captcha verification required" }, { status: 400 })
    } else {
      console.log("ℹ️ Turnstile not configured, skipping verification")
    }

    // Send to Discord webhook if configured
    if (discord_webhook) {
      const discordPayload = {
        embeds: [
          {
            title: "📧 New Contact Form Submission",
            color: 0x059669, // Primary color
            fields: [
              {
                name: "👤 Name",
                value: name,
                inline: true,
              },
              {
                name: "📧 Email",
                value: email,
                inline: true,
              },
              {
                name: "💬 Message",
                value: message.length > 1000 ? message.substring(0, 1000) + "..." : message,
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Uplift Kolektiv Contact Form",
            },
          },
        ],
      }

      const discordResponse = await fetch(discord_webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload),
      })

      if (!discordResponse.ok) {
        const errorText = await discordResponse.text()
        console.error("Discord webhook failed:", {
          status: discordResponse.status,
          statusText: discordResponse.statusText,
          error: errorText
        })
        return NextResponse.json({ error: "Failed to send message to Discord" }, { status: 500 })
      }
      
      console.log("Message sent successfully to Discord webhook")
    }

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
