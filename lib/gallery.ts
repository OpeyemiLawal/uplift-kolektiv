export interface GalleryImage {
  id: string
  filename: string
  url: string
  tags: string[]
  uploadedAt: string
}

// CDN gallery images data with correct URL format
export const localGalleryImages: GalleryImage[] = [
  {
    id: "1",
    filename: "rrhsnL.webp",
    url: "https://cdn.forgaming.ro/raw/rrhsnL.webp",
    tags: ["event", "night", "dj", "crowd"],
    uploadedAt: "2024-01-15T20:00:00Z",
  },
  {
    id: "2",
    filename: "JEAzIF.png",
    url: "https://cdn.forgaming.ro/raw/JEAzIF.png",
    tags: ["studio", "recording", "equipment"],
    uploadedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    filename: "vV1AaI.gif",
    url: "https://cdn.forgaming.ro/raw/vV1AaI.gif",
    tags: ["performance", "stage", "lights"],
    uploadedAt: "2024-01-08T22:15:00Z",
  },
  {
    id: "4",
    filename: "4A0Jt3.png",
    url: "https://cdn.forgaming.ro/raw/4A0Jt3.png",
    tags: ["crowd", "festival", "energy", "rhythm"],
    uploadedAt: "2024-01-05T21:45:00Z",
  },
  {
    id: "5",
    filename: "uzxzW2.jpg",
    url: "https://cdn.forgaming.ro/raw/uzxzW2.jpg",
    tags: ["backstage", "artists", "preparation"],
    uploadedAt: "2024-01-03T19:20:00Z",
  },
  {
    id: "6",
    filename: "FbIF7i.png",
    url: "https://cdn.forgaming.ro/raw/FbIF7i.png",
    tags: ["mixing", "console", "technical"],
    uploadedAt: "2024-01-01T16:00:00Z",
  },
  {
    id: "7",
    filename: "Jh9Nh1.png",
    url: "https://cdn.forgaming.ro/raw/Jh9Nh1.png",
    tags: ["performance", "live", "music"],
    uploadedAt: "2024-01-02T18:30:00Z",
  },
  {
    id: "8",
    filename: "yFcXlu.png",
    url: "https://cdn.forgaming.ro/raw/yFcXlu.png",
    tags: ["event", "crowd", "atmosphere"],
    uploadedAt: "2024-01-04T20:15:00Z",
  },
  {
    id: "9",
    filename: "POQVny.png",
    url: "https://cdn.forgaming.ro/raw/POQVny.png",
    tags: ["studio", "production", "creative"],
    uploadedAt: "2024-01-06T12:45:00Z",
  },
]

// Get all gallery images
export function getGalleryImages(): GalleryImage[] {
  return localGalleryImages
}

// Get unique tags from all images
export function getUniqueTagsFromImages(images: GalleryImage[]): string[] {
  const allTags = images.flatMap((image) => image.tags)
  return Array.from(new Set(allTags)).sort()
}

// Filter images by tag
export function filterImagesByTag(images: GalleryImage[], tag: string): GalleryImage[] {
  if (tag === "all") return images
  return images.filter((image) => image.tags.includes(tag))
}

// Get images by artist tag
export function getImagesByArtistTag(images: GalleryImage[], artistTag: string): GalleryImage[] {
  return images.filter((image) => image.tags.includes(artistTag))
}
