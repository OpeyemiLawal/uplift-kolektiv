import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export interface Artist {
  name: string
  "artist-tag": string
  "profile-url": string
  Genre: string
  Description: string
}

function getArtists(): Artist[] {
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

export async function GET() {
  try {
    const artists = getArtists()
    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
  }
}
