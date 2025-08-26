import { notFound } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { ArtistProfile } from "@/components/artist-profile"
import { getArtistByTag } from "@/lib/artists"

interface ArtistPageProps {
  params: {
    artist: string
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
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
  const { getArtists } = await import("@/lib/artists")
  const artists = getArtists()

  return artists.map((artist) => ({
    artist: artist["artist-tag"],
  }))
}
