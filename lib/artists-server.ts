import fs from "fs"
import path from "path"
import yaml from "js-yaml"

export interface Artist {
  name: string
  "artist-tag": string
  "profile-url": string
  Genre: string
  Description: string
}

export function getArtists(): Artist[] {
  const artistsDirectory = path.join(process.cwd(), "data/artists")

  if (!fs.existsSync(artistsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(artistsDirectory)
  const artists = filenames
    .filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
    .map((name) => {
      const fullPath = path.join(artistsDirectory, name)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const artist = yaml.load(fileContents) as Artist
      return artist
    })

  return artists
}

export function getArtistByTag(tag: string): Artist | null {
  const artists = getArtists()
  return artists.find((artist) => artist["artist-tag"] === tag) || null
}

