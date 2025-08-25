"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface ConfigStatus {
  gallery_folder: string
  zipline_configured: boolean
  discord_configured: boolean
  turnstile_configured: boolean
  artists_count: number
}

export function ConfigStatus() {
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/config-status')
        const data = await response.json()
        setConfig(data)
      } catch (error) {
        console.error('Failed to check config status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-blue-300">Checking configuration...</span>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300">Failed to check configuration</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300 font-medium">Configuration Status</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          {config.gallery_folder ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-gray-300">Gallery: {config.gallery_folder || 'Not set'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {config.zipline_configured ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          )}
          <span className="text-gray-300">Zipline: {config.zipline_configured ? 'Connected' : 'Local'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {config.discord_configured ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-gray-300">Discord: {config.discord_configured ? 'Connected' : 'Not set'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {config.turnstile_configured ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-gray-300">Turnstile: {config.turnstile_configured ? 'Active' : 'Not set'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Artists loaded:</span>
          <span className="text-gray-300 font-medium">{config.artists_count}</span>
        </div>
      </div>
    </div>
  )
}


