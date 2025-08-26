export const logo_path = process.env.NEXT_PUBLIC_LOGO_PATH || "/generated-logo.png"
export const hero_path = process.env.NEXT_PUBLIC_HERO_PATH || "/generated-hero.png"
export const hero_type = process.env.NEXT_PUBLIC_HERO_TYPE || "image" // "image" or "video"
export const discord_webhook = process.env.DISCORD_WEBHOOK_URL || null
export const cloudflare_secret = process.env.CLOUDFLARE_SECRET || null
export const cloudflare_site_key = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || null

// Social media links
export const social_links = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
  soundcloud: process.env.NEXT_PUBLIC_SOUNDCLOUD_URL || "#",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#",
}
