import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default">
              <Link href="/" className="flex items-center gap-2">
                <Home size={16} />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/artists" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                View Artists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
