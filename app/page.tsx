"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  const [showMainContent, setShowMainContent] = useState(false)

  const handleExplore = () => {
    setShowMainContent(true)
  }

  if (!showMainContent) {
    return (
      <MainLayout showIntro={true}>
        <HeroSection onExplore={handleExplore} />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">Welcome to Uplift Kolektiv</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our world of music, discover talented artists, and join our community. Use the sidebar navigation to
            browse our gallery, meet our artists, and get in touch.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
