import { useEffect, useRef } from 'react'

/**
 * hero.mp4 es una versión ping-pong: el clip original de 10s seguido de sí
 * mismo invertido. El último fotograma es idéntico al primero, así que el
 * loop no tiene corte. El original sin invertir está en originales/.
 */
const VIDEO_SRC = '/video/hero.mp4'
const POSTER_SRC = '/img/hero-poster.jpg'

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Silencio forzado: si el atributo muted llega tarde, el navegador
    // bloquea el autoplay en lugar de reproducir con sonido.
    video.muted = true
    video.defaultMuted = true

    const play = () => video.play().catch(() => {})

    play()

    // Si el autoplay se bloquea igual, reintentar tras la primera interacción.
    const retry = () => {
      video.muted = true
      play()
    }
    document.addEventListener('click', retry, { once: true })
    document.addEventListener('touchstart', retry, { once: true })

    return () => {
      document.removeEventListener('click', retry)
      document.removeEventListener('touchstart', retry)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={POSTER_SRC}
      className="absolute inset-0 z-0 h-full w-full object-cover"
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  )
}
