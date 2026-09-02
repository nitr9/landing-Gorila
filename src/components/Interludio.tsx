/**
 * Respiración entre el hero y el bloque de scroll. No lleva fondo propio:
 * hereda el verde del body para que la transición entre secciones no tenga
 * costura visible.
 */
export function Interludio() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-8 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-accent-red">
        El silencio
      </p>

      <h2
        className="mt-8 text-4xl font-normal leading-[1.1] tracking-[-1px] text-foreground sm:text-5xl lg:text-6xl"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        No es la ausencia de sonido.{' '}
        <em className="not-italic text-white/50">Es donde empieza.</em>
      </h2>

      <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60">
        Todo lo que sigue está calibrado para una sola cosa: que lo único que
        llegue sea lo que elegiste escuchar.
      </p>
    </section>
  )
}
