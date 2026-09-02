import { Hero } from '@/components/Hero'
import { Navigation } from '@/components/Navigation'
import { VideoBackground } from '@/components/VideoBackground'

function App() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <VideoBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />
        <div className="flex flex-1 items-center justify-center">
          <Hero />
        </div>
      </div>
    </main>
  )
}

export default App
