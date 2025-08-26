import type { GalleryImage } from "./gallery"

export interface Artist {
  name: string
  "artist-tag": string
  "profile-url": string
  Genre: string
  Description: string
}

export async function getArtists(): Promise<Artist[]> {
  try {
    const response = await fetch('/api/artists')
    if (!response.ok) {
      throw new Error('Failed to fetch artists')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching artists:', error)
    return []
  }
}

export async function getArtistByTag(tag: string): Promise<Artist | null> {
  try {
    const response = await fetch(`/api/artists/${tag}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch artist')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching artist:', error)
    return null
  }
}

export async function getArtistImages(artistTag: string): Promise<GalleryImage[]> {
  const { getImagesByArtistTag, getGalleryImages } = await import("./gallery")
  const allImages = getGalleryImages()
  return getImagesByArtistTag(allImages, artistTag)
}
