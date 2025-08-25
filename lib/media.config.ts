// Environment variable validation
function validateRequiredEnvVar(name: string, value: string | undefined, defaultValue?: string): string {
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || defaultValue!
}

// Media configuration with validation
export const logo_path = validateRequiredEnvVar("NEXT_PUBLIC_LOGO_PATH", process.env.NEXT_PUBLIC_LOGO_PATH, "/generated-logo.png")
export const hero_path = validateRequiredEnvVar("NEXT_PUBLIC_HERO_PATH", process.env.NEXT_PUBLIC_HERO_PATH, "/generated-hero.png")
export const hero_type = process.env.NEXT_PUBLIC_HERO_TYPE || "image" // "image" or "video"
export const gallery_folder = validateRequiredEnvVar("NEXT_PUBLIC_GALLERY_FOLDER", process.env.NEXT_PUBLIC_GALLERY_FOLDER, "default-gallery")

// Integration configurations
export const discord_webhook = process.env.DISCORD_WEBHOOK_URL || null
export const cloudflare_secret = process.env.CLOUDFLARE_SECRET || null
export const cloudflare_site_key = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || null

// Zipline configuration
export const zipline_url = process.env.ZIPLINE_URL || null
export const zipline_token = process.env.ZIPLINE_TOKEN || null

// Social media links
export const social_links = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
  soundcloud: process.env.NEXT_PUBLIC_SOUNDCLOUD_URL || "#",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#",
}

// Configuration validation
export function validateConfig() {
  const errors: string[] = []
  
  if (!gallery_folder) {
    errors.push("Gallery folder is not configured")
  }
  
  // For Zipline-only setup, require both URL and token
  if (!zipline_url) {
    errors.push("ZIPLINE_URL is required")
  }
  
  if (!zipline_token) {
    errors.push("ZIPLINE_TOKEN is required")
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(", ")}`)
  }
}
