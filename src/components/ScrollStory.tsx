import { useEffect, useRef, useState } from 'react'

/**
 * Scrollytelling: el scroll controla la reproducción del video en vez de
 * dejarlo correr solo. El gorila gira a medida que se baja, y los textos
 * aparecen alternando izquierda y derecha en cada tramo.
 *
 * El video está encodeado con un keyframe cada 2 frames (ver
 * notas/DECISIONES.md), porque saltar a un currentTime arbitrario sobre un
 * encode normal da tirones.
 *
 * En móvil el scrubbing va a los saltos, así que ahí se muestra el poster
 * fijo y los textos apilados.
 */
const VIDEO_SRC = '/video/gorila-scroll.mp4'
const POSTER_SRC = '/img/gorila-scroll-poster.jpg'

/* Cada paso ocupa una fracción del recorrido. `at` es el punto donde la
   frase está plenamente visible, en progreso de 0 a 1. */
const PASOS = [
  {
    at: 0.18,
    lado: 'izquierda' as const,
    frase: 'Primero',
    destacado: 'desaparece el mundo.',
  },
  {
    at: 0.5,
    lado: 'derecha' as const,
    frase: 'Después',
    destacado: 'aparece todo lo demás.',
  },
  {
    at: 0.82,
    lado: 'izquierda' as const,
    frase: 'Y ya no hay',
    destacado: 'manera de volver atrás.',
  },
]

/* Ventana de aparición: cuánto antes y después del punto `at` el texto
   está visible. Suficientemente ancha para que no titile. */
const VENTANA = 0.16

export function ScrollStory() {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progreso, setProgreso] = useState(0)

  // El video pesa: se empieza a cargar recién cuando el bloque se acerca,
  // no al entrar a la página. Con preload="auto" se descargaban 17 MB
  // aunque nadie llegara hasta acá.
  useEffect(() => {
    const contenedor = contenedorRef.current
    const video = videoRef.current
    if (!contenedor || !video) return

    const precarga = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        video.preload = 'auto'
        video.load()
        precarga.disconnect()
      },
      { rootMargin: '150% 0px' }
    )
    precarga.observe(contenedor)
    return () => precarga.disconnect()
  }, [])

  useEffect(() => {
    const contenedor = contenedorRef.current
    const video = videoRef.current
    if (!contenedor || !video) return

    // En pantallas chicas el scrubbing no rinde: se deja el poster. Igual
    // con quien pidió menos movimiento.
    const esChica = window.matchMedia('(max-width: 767px)')
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (esChica.matches || sinMovimiento.matches) return

    let frameId = 0
    let objetivo = 0
    let actual = 0

    const alScrollear = () => {
      const rect = contenedor.getBoundingClientRect()
      const recorrido = contenedor.offsetHeight - window.innerHeight
      if (recorrido <= 0) return

      const p = Math.min(Math.max(-rect.top / recorrido, 0), 1)
      objetivo = p
      // Solo se re-renderiza si cambió qué frase está visible: actualizar el
      // estado en cada píxel de scroll dispara un render de React por evento.
      setProgreso((previo) =>
        PASOS.some(
          (paso) =>
            Math.abs(previo - paso.at) < VENTANA !==
            (Math.abs(p - paso.at) < VENTANA)
        )
          ? p
          : previo
      )

      if (!frameId) frameId = requestAnimationFrame(animar)
    }

    /*
     * Buscar un currentTime exacto en cada frame obliga al navegador a
     * decodificar de a saltos, y ahí aparecen los tirones. En vez de eso se
     * deja el video reproduciéndose y se controla su velocidad: mientras la
     * distancia al objetivo sea grande corre rápido, y al alcanzarlo se
     * frena. El decodificador trabaja en secuencia, que es lo que sabe
     * hacer bien.
     */
    const animar = () => {
      const duracion = video.duration
      if (!Number.isFinite(duracion)) {
        frameId = requestAnimationFrame(animar)
        return
      }

      actual = video.currentTime / duracion
      const delta = objetivo - actual

      if (Math.abs(delta) < 0.002) {
        // Llegó: se congela y se corta el loop. Sin esto el
        // requestAnimationFrame sigue corriendo a 60fps para siempre,
        // aunque nadie esté scrolleando.
        if (!video.paused) video.pause()
        frameId = 0
        return
      } else if (delta > 0) {
        // Hacia adelante: la velocidad acompaña la distancia que falta.
        video.playbackRate = Math.min(Math.max(Math.abs(delta) * 16, 0.5), 4)
        if (video.paused) video.play().catch(() => {})
      } else {
        // Hacia atrás no se puede reproducir: ahí sí hay que saltar, pero
        // de a poco, para que el salto sea corto y no se note.
        if (!video.paused) video.pause()
        const destino = (actual + delta * 0.18) * duracion
        video.currentTime = Math.min(Math.max(destino, 0), duracion - 0.05)
      }

      frameId = requestAnimationFrame(animar)
    }

    window.addEventListener('scroll', alScrollear, { passive: true })
    window.addEventListener('resize', alScrollear)
    alScrollear()

    return () => {
      window.removeEventListener('scroll', alScrollear)
      window.removeEventListener('resize', alScrollear)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div ref={contenedorRef} className="relative z-0 h-[320vh] md:h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          poster={POSTER_SRC}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Vela el video lo justo para que el texto se lea sobre cualquier
            momento del giro, sin apagar el verde. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-black/25"
          style={{
            // El velo tiene que apagarse antes del borde inferior: si corta
            // de golpe, su límite se ve como una línea horizontal sobre el
            // video (arriba oscurecido, abajo limpio).
            maskImage: 'linear-gradient(to bottom, #000 60%, transparent 96%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 60%, transparent 96%)',
          }}
        />

        {/*
          Fundidos arriba y abajo: empalman el video con la sección anterior
          y con la siguiente. Caen sobre el buzo y el fondo liso, nunca sobre
          la cara del gorila.
        */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-background to-transparent"
        />

        {PASOS.map((paso) => {
          const distancia = Math.abs(progreso - paso.at)
          const visible = distancia < VENTANA
          return (
            <div
              key={paso.frase}
              className={[
                'absolute top-1/2 w-[min(30rem,82vw)] -translate-y-1/2 px-8 transition-all duration-700 md:px-0',
                paso.lado === 'izquierda'
                  ? 'left-8 md:left-16 lg:left-24'
                  : 'right-8 md:right-16 lg:right-24',
                visible
                  ? 'translate-x-0 opacity-100'
                  : paso.lado === 'izquierda'
                    ? '-translate-x-6 opacity-0'
                    : 'translate-x-6 opacity-0',
              ].join(' ')}
            >
              <p
                className="text-4xl font-normal leading-[1.1] tracking-[-1px] text-foreground sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {paso.frase}{' '}
                <em className="not-italic text-white/50">{paso.destacado}</em>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
