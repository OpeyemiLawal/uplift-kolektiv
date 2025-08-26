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

function getArtistByTag(tag: string): Artist | null {
  const artists = getArtists()
  return artists.find((artist) => artist["artist-tag"] === tag) || null
}

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const artist = getArtistByTag(params.tag)
    
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }
    
    return NextResponse.json(artist)
  } catch (error) {
    console.error('Error fetching artist:', error)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}
