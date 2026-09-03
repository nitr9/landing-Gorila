import { useEffect, useRef } from 'react'

import { useAudio } from '@/lib/audio'

/**
 * Estelas de luz: el rastro que dejan los faros en una foto de larga
 * exposición. Líneas finas y continuas que cruzan la sección.
 *
 * Cuando hay música sonando, vibran con ella: los graves las hacen crecer,
 * brillar y temblar levemente. En silencio siguen pasando, pero quietas.
 *
 * El desplazamiento lo hace CSS (que corre en el compositor y no depende de
 * JavaScript) y la vibración se aplica encima como variables CSS, así el
 * movimiento base nunca se traba aunque el hilo principal esté ocupado.
 */
const ESTELAS = [
  { top: '14%', ancho: '52vw', duracion: 7, retraso: 0, tipo: 'faro' },
  { top: '31%', ancho: '38vw', duracion: 9, retraso: 3.2, tipo: 'trasera' },
  { top: '47%', ancho: '62vw', duracion: 6.2, retraso: 5.6, tipo: 'faro' },
  { top: '63%', ancho: '44vw', duracion: 8.4, retraso: 1.8, tipo: 'faro' },
  { top: '79%', ancho: '48vw', duracion: 7.6, retraso: 7.1, tipo: 'trasera' },
  { top: '90%', ancho: '34vw', duracion: 10, retraso: 4.4, tipo: 'faro' },
] as const

export function Estelas() {
  const { sonando, leerBandas } = useAudio()
  const contenedorRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    if (!sonando) {
      // En silencio vuelven a su estado de reposo.
      contenedor.style.setProperty('--pulso', '0')
      contenedor
        .querySelectorAll<HTMLElement>('.estela')
        .forEach((l) => l.style.setProperty('--sacudida', '0'))
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lineas = Array.from(
      contenedor.querySelectorAll<HTMLElement>('.estela')
    )

    /*
     * Detección de golpe por SALTO de energía, no por nivel.
     *
     * Un golpe de batería es un aumento brusco entre un frame y el
     * siguiente. El nivel a secas no sirve: en hip hop el bajo suena casi
     * todo el tiempo, así que un umbral de nivel vibra siempre. Y el
     * promedio móvil tampoco: se autoajusta y deja de disparar cuando la
     * música pega sostenido.
     *
     * Midiendo la diferencia entre frames, lo que se detecta es el ataque
     * —el "pum"— y no la nota sostenida que viene después.
     */
    let gravesPrevio = 0
    let mediosPrevio = 0
    let intensidad = 0
    let ultimoGolpe = 0
    let t = 0

    const SALTO_MIN = 0.055 // cuánto tiene que subir de un frame al otro
    const ESPERA = 110 // ms entre golpes: evita disparar dos veces con uno

    const animar = () => {
      const { graves, medios } = leerBandas()

      // Solo interesa cuánto SUBIÓ, no cuánto vale.
      const saltoGraves = Math.max(0, graves - gravesPrevio)
      const saltoMedios = Math.max(0, medios - mediosPrevio)
      gravesPrevio = graves
      mediosPrevio = medios

      // El bombo pesa más que el redoblante, pero los dos cuentan.
      const salto = saltoGraves * 1.4 + saltoMedios * 0.9

      const ahora = performance.now()
      if (salto > SALTO_MIN && ahora - ultimoGolpe > ESPERA) {
        ultimoGolpe = ahora
        // La fuerza del temblor sigue la del golpe.
        intensidad = Math.min(1, salto / 0.22)
      }

      // Decae rápido: el temblor es un impacto, no un estado.
      intensidad *= 0.82
      if (intensidad < 0.005) intensidad = 0

      contenedor.style.setProperty('--pulso', intensidad.toFixed(3))

      if (intensidad > 0) {
        t += 1.1
        for (let i = 0; i < lineas.length; i++) {
          // Fase propia: unas suben y otras bajan en el mismo golpe.
          const sacudida = Math.sin(t + i * 1.7) * intensidad * 7
          lineas[i].style.setProperty('--sacudida', sacudida.toFixed(2))
        }
      } else {
        for (let i = 0; i < lineas.length; i++) {
          lineas[i].style.setProperty('--sacudida', '0')
        }
      }

      frameRef.current = requestAnimationFrame(animar)
    }

    frameRef.current = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(frameRef.current)
  }, [sonando, leerBandas])

  return (
    <div
      ref={contenedorRef}
      aria-hidden
      className={`estelas${sonando ? ' estelas--vibrando' : ''}`}
      style={{ ['--pulso' as string]: '0' }}
    >
      {ESTELAS.map((e, i) => (
        <span
          key={i}
          className={`estela estela--${e.tipo}`}
          style={{
            top: e.top,
            width: e.ancho,
            animation: `estela-pasar ${e.duracion}s linear ${e.retraso}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
