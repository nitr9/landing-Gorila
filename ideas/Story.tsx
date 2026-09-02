import { Section } from '@/components/Section'

/**
 * Las dos secciones que siguen al hero.
 *
 * El arco es noche → amanecer, y la tesis es que el trabajo real ocurre
 * sin público. La sección 3 no cierra con un logro: cierra volviendo a
 * empezar, igual que el video, que va y vuelve sin resolverse.
 */
export function Story() {
  return (
    <>
      <Section
        image="/img/noche.jpg"
        align="left"
        eyebrow="I — The night"
        title={
          <>
            Nobody sees{' '}
            <em className="not-italic text-white/60">three in the morning.</em>
          </>
        }
      >
        <p>
          There is no audience for the part that matters. No applause for the
          draft you delete, the version that almost worked, the hour spent on
          something nobody will ever notice was hard.
        </p>
        <p>
          Just you, the screen, and the quiet suspicion that none of this is
          going anywhere.
        </p>
      </Section>

      <Section
        image="/img/amanecer.jpg"
        align="right"
        eyebrow="II — The morning"
        title={
          <>
            And then there is{' '}
            <em className="not-italic text-white/60">the morning.</em>
          </>
        }
      >
        <p>
          What survives the night does not need a story about how hard it was.
          It stands on its own, and the work explains itself.
        </p>
        <p>
          Then the light fades, and the silence returns, and there is more to
          make. That is not the price of the work. That is the work.
        </p>
      </Section>
    </>
  )
}
