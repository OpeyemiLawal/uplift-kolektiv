"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { GalleryGrid } from "@/components/gallery-grid"
import { TagFilter } from "@/components/tag-filter"
import { getGalleryImages, getUniqueTagsFromImages, filterImagesByTag, type GalleryImage } from "@/lib/gallery"

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [activeTag, setActiveTag] = useState("all")

  useEffect(() => {
    const loadImages = () => {
      const localImages = getGalleryImages()
      setImages(localImages)
      setFilteredImages(localImages)
      setTags(getUniqueTagsFromImages(localImages))
    }

    loadImages()
  }, [])

  const handleTagChange = (tag: string) => {
    setActiveTag(tag)
    setFilteredImages(filterImagesByTag(images, tag))
  }



  return (
    <MainLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Gallery</h1>
            <p className="text-lg text-gray-200">
              Explore moments from our events, studio sessions, and performances. Click on any image to view it in full
              size.
            </p>
          </div>

          <TagFilter tags={tags} activeTag={activeTag} onTagChange={handleTagChange} />

          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-200 text-lg">No images found for the selected tag.</p>
            </div>
          ) : (
            <GalleryGrid images={filteredImages} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
