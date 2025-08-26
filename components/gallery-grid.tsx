"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbox } from "./lightbox"
import type { GalleryImage } from "@/lib/gallery"

interface GalleryGridProps {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigateLightbox = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.filename}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay with tags */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {image.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  )
}
