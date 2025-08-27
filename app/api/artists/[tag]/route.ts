import { NextResponse } from 'next/server'
import { getArtistByTag } from '@/lib/artists-server'

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
