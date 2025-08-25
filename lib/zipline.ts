import { zipline_url, zipline_token, gallery_folder } from "./media.config"

export interface ZiplineImage {
  id: string
  filename: string
  url: string
  thumbnail?: string
  tags: string[]
  uploadedAt: string
}

// Fetch images from Zipline API or fallback to local images
export async function fetchZiplineImages(): Promise<ZiplineImage[]> {
  try {
    // Try Zipline API first if configured
    if (zipline_url && zipline_token) {
      console.log(`📡 Fetching images from Zipline folder: ${gallery_folder}`)
      return await fetchFromZiplineAPI()
    }
    
    // If Zipline is not configured, show error instead of falling back
    if (!zipline_url || !zipline_token) {
      throw new Error("Zipline is not configured. Please set ZIPLINE_URL and ZIPLINE_TOKEN environment variables.")
    }
    
    // Fallback to local images only if explicitly allowed
    console.warn("Zipline API failed, falling back to local images")
    return await fetchLocalImages()
  } catch (error) {
    console.error("Failed to fetch images from Zipline:", error)
    throw error // Re-throw to show error to user instead of silent fallback
  }
}

// Fetch images from Zipline API
async function fetchFromZiplineAPI(): Promise<ZiplineImage[]> {
  if (!zipline_url || !zipline_token) {
    throw new Error("Zipline not configured")
  }

  const response = await fetch(`${zipline_url}/api/v1/folders/${gallery_folder}/files`, {
    headers: {
      Authorization: `Bearer ${zipline_token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Zipline API error: ${response.status}`)
  }

  const data = await response.json()
  
  return data.files.map((file: any) => ({
    id: file.id,
    filename: file.name,
    url: `${zipline_url}/api/v1/files/${file.id}`,
    thumbnail: file.thumbnail ? `${zipline_url}/api/v1/files/${file.id}/thumbnail` : undefined,
    tags: extractTagsFromFilename(file.name),
    uploadedAt: file.createdAt,
  }))
}

// Fetch local images from public folder
async function fetchLocalImages(): Promise<ZiplineImage[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Local images based on gallery folder
  const localImages: ZiplineImage[] = [
    {
      id: "1",
      filename: "event-night-1.jpg",
      url: "/electronic-music-event.png",
      tags: ["event", "night", "dj", "crowd"],
      uploadedAt: "2024-01-15T20:00:00Z",
    },
    {
      id: "2",
      filename: "studio-session.jpg",
      url: "/placeholder-8xu71.png",
      tags: ["studio", "recording", "equipment"],
      uploadedAt: "2024-01-10T14:30:00Z",
    },
    {
      id: "3",
      filename: "artist-performance.jpg",
      url: "/dj-performance.png",
      tags: ["performance", "stage", "lights", "example"],
      uploadedAt: "2024-01-08T22:15:00Z",
    },
    {
      id: "4",
      filename: "crowd-energy.jpg",
      url: "/placeholder-0g00r.png",
      tags: ["crowd", "festival", "energy", "rhythm"],
      uploadedAt: "2024-01-05T21:45:00Z",
    },
    {
      id: "5",
      filename: "backstage-moment.jpg",
      url: "/backstage-artists-prep.png",
      tags: ["backstage", "artists", "preparation"],
      uploadedAt: "2024-01-03T19:20:00Z",
    },
    {
      id: "6",
      filename: "sound-mixing.jpg",
      url: "/placeholder-aythk.png",
      tags: ["mixing", "console", "technical", "example"],
      uploadedAt: "2024-01-01T16:00:00Z",
    },
  ]

  return localImages
}

// Extract tags from filename (e.g., "event-night-dj.jpg" -> ["event", "night", "dj"])
function extractTagsFromFilename(filename: string): string[] {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
  return nameWithoutExt.split(/[-_\s]+/).filter(tag => tag.length > 0)
}

export function getUniqueTagsFromImages(images: ZiplineImage[]): string[] {
  const allTags = images.flatMap((image) => image.tags)
  return Array.from(new Set(allTags)).sort()
}

export function filterImagesByTag(images: ZiplineImage[], tag: string): ZiplineImage[] {
  if (tag === "all") return images
  return images.filter((image) => image.tags.includes(tag))
}

export function getImagesByArtistTag(images: ZiplineImage[], artistTag: string): ZiplineImage[] {
  return images.filter((image) => image.tags.includes(artistTag))
}
