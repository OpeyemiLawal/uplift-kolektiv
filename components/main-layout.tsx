"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { IntroAnimation } from "./intro-animation"

interface MainLayoutProps {
  children: React.ReactNode
  showIntro?: boolean
}

export function MainLayout({ children, showIntro = false }: MainLayoutProps) {
  const [introComplete, setIntroComplete] = useState(!showIntro)
  const [sidebarVisible, setSidebarVisible] = useState(!showIntro)

  const handleIntroComplete = () => {
    setIntroComplete(true)
    // Delay sidebar appearance for smooth transition
    setTimeout(() => {
      setSidebarVisible(true)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      {showIntro && !introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

      <Sidebar isVisible={sidebarVisible && introComplete} />

      <main
        className={`
          transition-all duration-600 ease-out
          ${sidebarVisible && introComplete ? "ml-80" : "ml-0"}
        `}
      >
        {children}
      </main>
    </div>
  )
}
