"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { GalleryGrid } from "./gallery-grid"
import { getArtistImages, type Artist } from "@/lib/artists"
import type { GalleryImage } from "@/lib/gallery"
import { Loader2, Music } from "lucide-react"

interface ArtistProfileProps {
  artist: Artist
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  const [artistImages, setArtistImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArtistImages = async () => {
      try {
        const images = await getArtistImages(artist["artist-tag"])
        setArtistImages(images)
      } catch (error) {
        console.error("Failed to load artist images:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArtistImages()
  }, [artist])

  const genres = artist.Genre.split(", ").map((genre) => genre.trim())

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src={artist["profile-url"] || "/placeholder.svg?height=320&width=320"}
                  alt={artist.name}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Music className="text-blue-500" size={32} />
                <h1 className="text-5xl font-bold text-white">{artist.name}</h1>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                {genres.map((genre) => (
                  <motion.span
                    key={genre}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + genres.indexOf(genre) * 0.1 }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 font-semibold text-sm rounded-full border border-blue-500/30 shadow-sm"
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg text-gray-300 leading-relaxed max-w-2xl"
              >
                {artist.Description}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Artist Gallery Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Gallery</h2>
            <p className="text-gray-300 text-lg">Explore moments and performances featuring {artist.name}</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-300">Loading artist gallery...</p>
              </div>
            </div>
          ) : artistImages.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <GalleryGrid images={artistImages} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Gallery Images Yet</h3>
                <p className="text-gray-300">
                  Images featuring {artist.name} will appear here once they're tagged in our gallery.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
