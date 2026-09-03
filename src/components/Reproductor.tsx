import { useEffect, useRef, useState } from 'react'

/**
 * Reproductor propio: las ondas son toda la interfaz.
 *
 * Audio local en vez del iframe de Spotify porque el navegador no deja
 * controlar un iframe de otro dominio: oculto, no habría forma de darle
 * play. Con archivo propio las barras además reaccionan al sonido real, vía
 * AnalyserNode, en vez de animarse por CSS.
 */
const AUDIO_SRC = '/audio/ambiente.mp3'
const BARRAS = 7
const VOLUMEN_INICIAL = 0.55

export function Reproductor() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const barrasRef = useRef<Array<HTMLSpanElement | null>>([])
  const analizadorRef = useRef<AnalyserNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const frameRef = useRef(0)

  const [sonando, setSonando] = useState(false)
  const [volumen, setVolumen] = useState(VOLUMEN_INICIAL)
  const [hayAudio, setHayAudio] = useState(true)

  // El AudioContext necesita un gesto del usuario, así que el analizador se
  // crea recién en el primer play.
  const conectarAnalizador = () => {
    const audio = audioRef.current
    if (!audio || analizadorRef.current) return

    const Contexto =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new Contexto()
    const fuente = ctx.createMediaElementSource(audio)
    const analizador = ctx.createAnalyser()
    analizador.fftSize = 128
    analizador.smoothingTimeConstant = 0.75
    fuente.connect(analizador)
    analizador.connect(ctx.destination)
    analizadorRef.current = analizador
    ctxRef.current = ctx
  }

  // Se reutiliza el buffer: crear un Uint8Array por frame (60 por segundo)
  // genera basura innecesaria para el recolector.
  const datosRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  const animar = () => {
    const analizador = analizadorRef.current
    if (!analizador) return

    if (!datosRef.current || datosRef.current.length !== analizador.frequencyBinCount) {
      datosRef.current = new Uint8Array(analizador.frequencyBinCount)
    }
    const datos = datosRef.current
    analizador.getByteFrequencyData(datos)

    barrasRef.current.forEach((barra, i) => {
      if (!barra) return
      // Las barras del centro toman graves y las de los costados, agudos:
      // el movimiento queda simétrico, como un ecualizador clásico.
      const centro = Math.abs(i - (BARRAS - 1) / 2)
      const banda = Math.round(centro * 4) + 2
      const valor = datos[banda] ?? 0
      const escala = 0.25 + (valor / 255) * 1.9
      barra.style.transform = `scaleY(${escala})`
    })

    frameRef.current = requestAnimationFrame(animar)
  }

  const alternar = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      conectarAnalizador()
      audio
        .play()
        .then(() => {
          setSonando(true)
          // Cancelar antes de pedir uno nuevo: dos clics rápidos dejarían
          // dos loops corriendo en paralelo.
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(animar)
        })
        .catch(() => setHayAudio(false))
    } else {
      audio.pause()
      setSonando(false)
      cancelAnimationFrame(frameRef.current)
      barrasRef.current.forEach((b) => {
        if (b) b.style.transform = 'scaleY(0.25)'
      })
    }
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volumen
  }, [volumen])

  // Si el audio se detiene por cualquier vía (fin de pista, error, el
  // sistema lo pausa), hay que reflejarlo y frenar la animación: si no, las
  // barras siguen corriendo contra un audio detenido.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const alDetenerse = () => {
      setSonando(false)
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
      barrasRef.current.forEach((b) => {
        if (b) b.style.transform = 'scaleY(0.25)'
      })
    }

    audio.addEventListener('pause', alDetenerse)
    audio.addEventListener('ended', alDetenerse)
    return () => {
      audio.removeEventListener('pause', alDetenerse)
      audio.removeEventListener('ended', alDetenerse)
    }
  }, [])

  // Al desmontar: frenar la animación y cerrar el AudioContext, que si no
  // queda vivo consumiendo recursos.
  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current)
      void ctxRef.current?.close()
    },
    []
  )

  if (!hayAudio) return null

  return (
    <div className="fixed bottom-8 left-8 z-50 hidden sm:flex sm:items-center sm:gap-5">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        onError={() => setHayAudio(false)}
      />

      <button
        onClick={alternar}
        aria-label={sonando ? 'Pausar la música' : 'Reproducir música'}
        aria-pressed={sonando}
        className="group flex h-14 items-center transition-transform hover:scale-105"
      >
        <span aria-hidden className="flex h-14 items-center gap-[5px]">
          {Array.from({ length: BARRAS }).map((_, i) => {
            const centro = Math.abs(i - (BARRAS - 1) / 2)
            // En reposo dibuja una silueta de ecualizador.
            const alto = ['h-9', 'h-7', 'h-5', 'h-3'][Math.round(centro)]
            return (
              <span
                key={i}
                ref={(el) => {
                  barrasRef.current[i] = el
                }}
                className={[
                  'w-[3px] origin-center rounded-full transition-colors duration-500',
                  alto,
                  sonando
                    ? 'bg-accent-red shadow-[0_0_12px_hsl(var(--accent-red)/0.5)]'
                    : 'bg-white/35 group-hover:bg-white/60',
                ].join(' ')}
                style={{ transform: 'scaleY(0.25)' }}
              />
            )
          })}
        </span>
      </button>

      {/* El control de volumen aparece solo mientras suena. */}
      <div
        className={[
          'flex items-center transition-all duration-700',
          sonando
            ? 'w-24 translate-x-0 opacity-100'
            : 'pointer-events-none w-0 -translate-x-3 opacity-0',
        ].join(' ')}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volumen}
          onChange={(e) => setVolumen(Number(e.target.value))}
          aria-label="Volumen"
          className="slider-volumen w-24"
          style={{
            background: `linear-gradient(to right, hsl(var(--accent-red)) ${volumen * 100}%, rgba(255,255,255,0.18) ${volumen * 100}%)`,
          }}
        />
      </div>
    </div>
  )
}
