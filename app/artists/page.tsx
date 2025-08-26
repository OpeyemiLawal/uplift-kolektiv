import { MainLayout } from "@/components/main-layout"
import { getArtists } from "@/lib/artists"
import { ArtistCard } from "@/components/artist-card"

export default function ArtistsPage() {
  const artists = getArtists()

  return (
    <MainLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Our Artists</h1>
            <p className="text-lg text-gray-200 leading-relaxed">
              Meet the talented individuals who make up Uplift Kolektiv. Each artist brings their unique style and
              energy to our collective.
            </p>
          </div>

          {artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <ArtistCard key={artist["artist-tag"]} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card rounded-xl p-12 border border-border">
                <h3 className="text-xl font-semibold text-white mb-2">No Artists Yet</h3>
                <p className="text-gray-200">Artist profiles will appear here once they're added to the system.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
