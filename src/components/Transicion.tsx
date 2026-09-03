import { Estelas } from '@/components/Estelas'
import { TextAnimate } from '@/components/ui/text-animate'
import { useEnVista } from '@/lib/useEnVista'

/**
 * Puente entre el giro y el cierre. Además de decir algo, sostiene la
 * separación que necesita la transición: sin este aire, el producto aparece
 * pisando al gorila.
 */
export function Transicion() {
  const { ref, enVista } = useEnVista<HTMLDivElement>(0.4)

  return (
    <section
      className="relative z-10 flex min-h-[80vh] items-center justify-center overflow-hidden px-8"
      style={{
        // El cambio de color se reparte en toda la altura, no solo en el
        // último tramo: si se concentra al final, llega al borde sin
        // terminar y el empalme con el cierre se ve como una línea.
        background:
          'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background)) 15%, hsl(var(--verde-cierre)) 100%)',
      }}
    >
      {/* Estelas de luz cruzando la sección */}
      <Estelas />

      <div ref={ref} className="relative max-w-3xl text-center">
        <p
          className={[
            'text-xs uppercase tracking-[0.25em] text-accent-red',
            'transition-all duration-700 ease-out',
            enVista ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          Y entonces
        </p>

        <TextAnimate
          text="Lo único que queda es elegir qué escuchar."
          type="calmInUp"
          className="mt-8 justify-center text-3xl font-normal leading-[1.15] tracking-[-0.5px] text-foreground sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        />
      </div>
    </section>
  )
}
