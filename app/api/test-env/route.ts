import { NextResponse } from "next/server"
import { discord_webhook, cloudflare_secret, cloudflare_site_key } from "@/lib/media.config"

export async function GET() {
  return NextResponse.json({
    discord_webhook: discord_webhook ? 'SET' : 'NOT SET',
    cloudflare_secret: cloudflare_secret ? 'SET' : 'NOT SET',
    cloudflare_site_key: cloudflare_site_key ? 'SET' : 'NOT SET',
    discord_url_preview: discord_webhook ? discord_webhook.substring(0, 50) + '...' : 'NOT SET',
    env_vars: {
      DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL ? 'SET' : 'NOT SET',
      CLOUDFLARE_SECRET: process.env.CLOUDFLARE_SECRET ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_CLOUDFLARE_SITE_KEY: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ? 'SET' : 'NOT SET'
    }
  })
}
