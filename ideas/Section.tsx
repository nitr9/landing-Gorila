import { useEffect, useRef, useState, type ReactNode } from 'react'

interface SectionProps {
  /** Imagen de fondo, servida desde public/ */
  image: string
  /** Lado en el que va el panel de imagen ('left' = imagen a la izquierda) */
  align?: 'left' | 'right'
  /** Texto pequeño sobre el titular */
  eyebrow: string
  /** Titular, en Instrument Serif */
  title: ReactNode
  children: ReactNode
}

/**
 * Sección a pantalla completa: panel de imagen a un lado, texto al otro.
 *
 * El panel ocupa media pantalla en vez de todo el ancho porque las imágenes
 * salen de recortar un panel del video (310px de ancho): estiradas a pantalla
 * completa se pixelan. A media pantalla quedan cerca de su tamaño nativo.
 */
export function Section({
  image,
  align = 'left',
  eyebrow,
  title,
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={[
        'relative flex min-h-screen items-center overflow-hidden bg-background',
        align === 'right' ? 'md:flex-row-reverse' : '',
      ].join(' ')}
    >
      {/* Panel de imagen: media pantalla, cerca de su resolución nativa.
          En móvil pasa a fondo con velo, porque no hay ancho para dos columnas. */}
      <div className="absolute inset-0 md:relative md:h-screen md:w-1/2 md:shrink-0">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Degradado que funde el panel con el fondo del texto */}
        <div
          className={[
            'absolute inset-0 bg-black/55 md:bg-none',
            /* En desktop solo se funde el borde interno con el fondo del texto;
               el resto del panel queda con sus colores intactos. */
            align === 'left'
              ? 'md:bg-gradient-to-r md:from-transparent md:from-70% md:to-background'
              : 'md:bg-gradient-to-l md:from-transparent md:from-70% md:to-background',
          ].join(' ')}
        />
      </div>

      <div className="relative z-10 w-full px-8 py-24 md:w-1/2 md:px-16">
        <div
          className={[
            'mx-auto max-w-xl transition-all duration-1000 ease-out',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          ].join(' ')}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/50">
            {eyebrow}
          </p>

          <h2
            className="text-4xl leading-[1.05] tracking-[-1px] text-foreground sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {title}
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/75 sm:text-lg">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
