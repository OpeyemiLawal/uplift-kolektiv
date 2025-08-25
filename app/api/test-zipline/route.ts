import { NextResponse } from 'next/server'
import { zipline_url, zipline_token, gallery_folder } from '@/lib/media.config'

export async function GET() {
  try {
    console.log("🧪 Testing Zipline integration...")
    console.log("📡 Zipline URL:", zipline_url)
    console.log("🔑 Zipline Token:", zipline_token ? "SET" : "NOT SET")
    console.log("📁 Gallery Folder:", gallery_folder)

    if (!zipline_url || !zipline_token) {
      return NextResponse.json({
        success: false,
        error: "Zipline not configured",
        details: {
          url_configured: !!zipline_url,
          token_configured: !!zipline_token
        }
      }, { status: 400 })
    }

    // Test the Zipline API endpoint
    const testUrl = `${zipline_url}/api/v1/folders/${gallery_folder}/files`
    console.log("🔗 Testing URL:", testUrl)

    const response = await fetch(testUrl, {
      headers: {
        Authorization: `Bearer ${zipline_token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("📡 Zipline API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Zipline API error:", errorText)
      
      return NextResponse.json({
        success: false,
        error: `Zipline API error: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        }
      }, { status: response.status })
    }

    const data = await response.json()
    console.log("✅ Zipline API test successful")
    console.log("📊 Files found:", data.files?.length || 0)

    return NextResponse.json({
      success: true,
      message: "Zipline integration working",
      details: {
        files_count: data.files?.length || 0,
        folder: gallery_folder,
        url: zipline_url
      },
      sample_files: data.files?.slice(0, 3) || []
    })

  } catch (error) {
    console.error("❌ Zipline test error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to test Zipline integration",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
