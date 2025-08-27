import { NextResponse } from 'next/server'
import { getArtists } from '@/lib/artists-server'

export async function GET() {
  try {
    const artists = getArtists()
    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
  }
}
