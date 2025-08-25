"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { GalleryGrid } from "@/components/gallery-grid"
import { TagFilter } from "@/components/tag-filter"
import { fetchZiplineImages, getUniqueTagsFromImages, filterImagesByTag, type ZiplineImage } from "@/lib/zipline"
import { validateConfig } from "@/lib/media.config"
import { ConfigStatus } from "@/components/config-status"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"

export default function GalleryPage() {
  const [images, setImages] = useState<ZiplineImage[]>([])
  const [filteredImages, setFilteredImages] = useState<ZiplineImage[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [activeTag, setActiveTag] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Validate configuration
        try {
          validateConfig()
        } catch (configError) {
          setError(`Configuration error: ${configError instanceof Error ? configError.message : 'Unknown error'}`)
          return
        }
        
        const fetchedImages = await fetchZiplineImages()
        setImages(fetchedImages)
        setFilteredImages(fetchedImages)
        setTags(getUniqueTagsFromImages(fetchedImages))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load gallery images"
        setError(errorMessage)
        console.error("Gallery loading error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  const handleTagChange = (tag: string) => {
    setActiveTag(tag)
    setFilteredImages(filterImagesByTag(images, tag))
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-white">Loading gallery...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6 mb-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Gallery Error</h2>
              <p className="text-red-300 mb-4">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      </MainLayout>
    )
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

          <ConfigStatus />

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
