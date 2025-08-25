"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { Artist } from "@/lib/artists"

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const genres = artist.Genre.split(", ").map((genre) => genre.trim())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/artist/${artist["artist-tag"]}`}>
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300">
          {/* Artist Image */}
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={artist["profile-url"] || "/placeholder.svg?height=300&width=300"}
              alt={artist.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Artist Info */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200">
              {artist.name}
            </h3>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                >
                  {genre}
                </span>
              ))}
              {genres.length > 3 && (
                <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">+{genres.length - 3}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{artist.Description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
