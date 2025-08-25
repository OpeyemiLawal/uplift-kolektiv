import { NextResponse } from "next/server"
import { 
  gallery_folder, 
  zipline_url, 
  zipline_token, 
  discord_webhook, 
  cloudflare_secret, 
  cloudflare_site_key 
} from "@/lib/media.config"
import { getArtists } from "@/lib/artists"

export async function GET() {
  try {
    const artists = getArtists()
    
    return NextResponse.json({
      gallery_folder: gallery_folder || null,
      zipline_configured: !!(zipline_url && zipline_token),
      zipline_url: zipline_url ? `${zipline_url.substring(0, 30)}...` : null,
      discord_configured: !!discord_webhook,
      turnstile_configured: !!(cloudflare_secret && cloudflare_site_key),
      artists_count: artists.length,
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    console.error("Config status error:", error)
    return NextResponse.json({
      error: "Failed to check configuration status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
