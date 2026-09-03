import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

/**
 * Cierre: los auriculares apareciendo sobre el soporte. El video se
 * reproduce una sola vez, cuando la sección entra en pantalla, y queda
 * congelado en el último fotograma — no es un loop.
 */
const VIDEO_SRC = '/video/producto.mp4'
/* El poster es el PRIMER fotograma (soporte vacío), no el último: si
   muestra los auriculares ya puestos, al arrancar el video parece que la
   escena se reinicia. */
const POSTER_SRC = '/img/producto-poster.jpg'

export function Cierre() {
  const seccionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seccion = seccionRef.current
    const video = videoRef.current
    if (!seccion || !video) return

    video.muted = true
    video.defaultMuted = true

    // Se empieza a bajar el video antes de que la sección entre, para que
    // esté listo al llegar, pero no en la carga inicial de la página.
    const precarga = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        video.preload = 'auto'
        video.load()
        precarga.disconnect()
      },
      { rootMargin: '120% 0px' }
    )
    precarga.observe(seccion)

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return

        setVisible(true)

        // Quien pidió menos movimiento ve el último fotograma en vez de la
        // animación completa.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.currentTime = video.duration || 0
        } else {
          video.play().catch(() => {})
        }
        // Una sola vez: cumplido su trabajo, deja de observar.
        observador.disconnect()
      },
      { threshold: 0.45 }
    )

    observador.observe(seccion)
    return () => {
      observador.disconnect()
      precarga.disconnect()
    }
  }, [])

  return (
    <section
      ref={seccionRef}
      className="relative z-20 min-h-screen w-full overflow-hidden bg-verde-cierre"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        poster={POSTER_SRC}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          // El fondo del video está viñeteado (30% en los bordes, 34% en el
          // centro), así que ningún color plano puede empalmar con él sin
          // dejar escalón. En vez de taparlo con un overlay, el propio
          // video se desvanece: sin borde no hay línea.
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 9%, #000 26%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 9%, #000 26%)',
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* El texto se apoya abajo, para no taparle los auriculares. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-8 pb-28 text-center">
        <h2
          className={[
            'max-w-2xl text-4xl font-normal leading-[1.05] tracking-[-1px] text-foreground transition-all [transition-duration:1600ms] sm:text-5xl lg:text-6xl',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          ].join(' ')}
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Todo lo demás{' '}
          <em className="not-italic text-white/50">puede esperar.</em>
        </h2>

        <div
          className={[
            'mt-12 transition-all [transition-delay:800ms] [transition-duration:1600ms]',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          ].join(' ')}
        >
          <Button variant="glass-square" size="cta">
            Explorar audífonos
          </Button>
        </div>
      </div>
    </section>
  )
}
