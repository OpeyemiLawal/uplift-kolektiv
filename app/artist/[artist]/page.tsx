import { notFound } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { ArtistProfile } from "@/components/artist-profile"
import { getArtistByTag, getArtists } from "@/lib/artists-server"

interface ArtistPageProps {
  params: {
    artist: string
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = getArtistByTag(params.artist)

  if (!artist) {
    notFound()
  }

  return (
    <MainLayout>
      <ArtistProfile artist={artist} />
    </MainLayout>
  )
}

export async function generateStaticParams() {
  const artists = getArtists()

  return artists.map((artist) => ({
    artist: artist["artist-tag"],
  }))
}
