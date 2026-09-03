/**
 * Marca de la esquina: NT con el ® en superíndice, en Instrument Serif.
 * Va fija arriba a la izquierda, por encima del video.
 */
export function Logo() {
  return (
    <a
      href="#inicio"
      aria-label="NT, ir al inicio"
      className="animate-fade-rise absolute left-8 top-8 z-20 text-3xl tracking-tight text-accent-red md:left-16 lg:left-24"
      style={{ fontFamily: "'Instrument Serif', serif" }}
    >
      NT<sup className="text-xs">®</sup>
    </a>
  )
}
