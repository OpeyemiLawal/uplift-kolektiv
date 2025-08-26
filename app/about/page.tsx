import { MainLayout } from "@/components/main-layout"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Who are we?</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
              <p className="text-gray-200 leading-relaxed mb-6">
                Uplift Kolektiv was born from a shared passion for music that transcends boundaries. We are a collective
                of artists, DJs, and music enthusiasts who believe in the power of rhythm to unite people from all walks
                of life.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Our mission is simple: to create spaces where music can flourish, where artists can collaborate, and
                where audiences can experience the transformative power of sound. Every beat, every melody, every
                performance is crafted with the intention to lift spirits and bring people together.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Vision</h2>
              <p className="text-gray-200 leading-relaxed">
                We envision a world where music serves as a universal language, breaking down barriers and creating
                connections that last a lifetime. Through our events, collaborations, and community initiatives, we
                strive to build a platform where creativity knows no limits and where every voice can be heard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
