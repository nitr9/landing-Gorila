/**
 * Puente entre el giro y el cierre. Además de decir algo, sostiene la
 * separación que necesita la transición: sin este aire, el producto aparece
 * pisando al gorila.
 */
export function Transicion() {
  return (
    <section
      className="relative z-10 flex min-h-[80vh] items-center justify-center px-8"
      style={{
        // El cambio de color se reparte en toda la altura, no solo en el
        // último tramo: si se concentra al final, llega al borde sin
        // terminar y el empalme con el cierre se ve como una línea.
        background:
          'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background)) 15%, hsl(var(--verde-cierre)) 100%)',
      }}
    >
      <div className="relative max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent-red">
          Y entonces
        </p>

        <p
          className="mt-8 text-3xl font-normal leading-[1.15] tracking-[-0.5px] text-foreground sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Lo único que queda{' '}
          <em className="not-italic text-white/50">es elegir qué escuchar.</em>
        </p>
      </div>
    </section>
  )
}
