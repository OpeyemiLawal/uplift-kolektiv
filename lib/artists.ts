import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import type { ZiplineImage } from "./zipline"

export interface Artist {
  name: string
  "artist-tag": string
  "profile-url": string
  Genre: string
  Description: string
}

// Validate artist data structure
function validateArtist(artist: any, filename: string): Artist {
  const requiredFields = ["name", "artist-tag", "profile-url", "Genre", "Description"]
  const missingFields = requiredFields.filter(field => !artist[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Artist file ${filename} is missing required fields: ${missingFields.join(", ")}`)
  }
  
  // Validate artist-tag format (should be lowercase, no spaces)
  if (!/^[a-z0-9-]+$/.test(artist["artist-tag"])) {
    throw new Error(`Artist file ${filename} has invalid artist-tag format. Use lowercase letters, numbers, and hyphens only.`)
  }
  
  return artist as Artist
}

export function getArtists(): Artist[] {
  const artistsDirectory = path.join(process.cwd(), "data/artists")

  if (!fs.existsSync(artistsDirectory)) {
    console.warn("Artists directory not found:", artistsDirectory)
    return []
  }

  try {
    const filenames = fs.readdirSync(artistsDirectory)
    const artists = filenames
      .filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
      .map((name) => {
        try {
          const fullPath = path.join(artistsDirectory, name)
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const artist = yaml.load(fileContents) as any
          return validateArtist(artist, name)
        } catch (error) {
          console.error(`Error loading artist file ${name}:`, error)
          return null
        }
      })
      .filter((artist): artist is Artist => artist !== null)

    return artists
  } catch (error) {
    console.error("Error loading artists:", error)
    return []
  }
}

export function getArtistByTag(tag: string): Artist | null {
  const artists = getArtists()
  return artists.find((artist) => artist["artist-tag"] === tag) || null
}

export async function getArtistImages(artistTag: string): Promise<ZiplineImage[]> {
  const { getImagesByArtistTag, fetchZiplineImages } = await import("./zipline")
  const allImages = await fetchZiplineImages()
  return getImagesByArtistTag(allImages, artistTag)
}
