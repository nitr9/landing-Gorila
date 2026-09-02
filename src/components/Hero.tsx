import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col justify-center px-8 md:w-3/5 md:px-16 lg:px-24">
      <h1
        className="animate-fade-rise text-5xl font-normal leading-[0.95] tracking-[-1.5px] text-foreground sm:text-6xl lg:text-7xl"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Con los auriculares{' '}
        <em className="not-italic text-white/50">puestos.</em>
      </h1>

      <p className="animate-fade-rise-delay mt-8 max-w-md text-base leading-relaxed text-white/70">
        Cancelación activa de tres micrófonos y un escenario sonoro que se
        cierra sobre vos. Afuera puede estar pasando cualquier cosa: acá
        adentro está solamente lo que elegiste escuchar.
      </p>

      <div className="animate-fade-rise-delay-2 mt-10">
        <Button variant="glass-square" size="cta">
          Explorar audífonos
        </Button>
      </div>
    </section>
  )
}
