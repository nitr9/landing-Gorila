import { Cierre } from '@/components/Cierre'
import { Hero } from '@/components/Hero'
import { Interludio } from '@/components/Interludio'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Reproductor } from '@/components/Reproductor'
import { ScrollStory } from '@/components/ScrollStory'
import { Transicion } from '@/components/Transicion'
import { VideoPanel } from '@/components/VideoPanel'
import { ProveedorAudio } from '@/lib/audio'

function App() {
  return (
    <ProveedorAudio>
      <main className="relative w-full bg-background">
        {/* El hero es la única sección con su propio video de fondo; el resto
            hereda el verde del body para que no haya costura entre bloques. */}
        <section
          id="inicio"
          className="relative min-h-screen w-full overflow-hidden bg-background"
        >
          <VideoPanel />
          <Logo />
          <Navigation />
          <Hero />
        </section>

        <Interludio />
        <ScrollStory />
        <Transicion />
        <Cierre />

        <Reproductor />
      </main>
    </ProveedorAudio>
  )
}

export default App
