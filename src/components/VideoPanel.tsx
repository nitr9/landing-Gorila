import { useEffect, useRef } from 'react'

/**
 * La toma ya trae al gorila sobre la derecha y la mitad izquierda en verde
 * plano, así que el video va de fondo completo y el texto se apoya sobre ese
 * espacio negativo en lugar de partir la pantalla en dos columnas.
 *
 * Es ping-pong (10s + los mismos 10s invertidos): la cabeza empieza girada y
 * termina de frente, así que el loop directo saltaba. Ver notas/DECISIONES.md.
 */
const VIDEO_SRC = '/video/gorila.mp4'
const POSTER_SRC = '/img/gorila-poster.jpg'

export function VideoPanel() {
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
    <>
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

      {/*
        En móvil el gorila y el texto compiten por el mismo espacio, así que
        el degradado desde la izquierda sostiene la lectura sin tapar la cara.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-r from-background/95 via-background/60 to-transparent md:from-background/80 md:via-background/20"
        style={{
          // Se apaga antes del piso: si llega entero hasta abajo, su corte
          // se suma al del video y la costura vuelve a verse.
          maskImage: 'linear-gradient(to bottom, #000 55%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 92%)',
        }}
      />

      {/* Foco cálido desde la esquina superior izquierda: apenas una
          insinuación de luz sobre el verde plano. */}
      <div aria-hidden className="foco-lateral z-[2]" />

      {/*
        Funde el borde inferior del video con el fondo de la sección
        siguiente. Sin esto el empalme se ve como una línea horizontal,
        porque el verde del video es más claro que --background.
        Cae sobre el buzo, así que no toca la cara del gorila.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[2] h-[45vh] bg-gradient-to-b from-transparent via-background/70 to-background"
      />
    </>
  )
}
