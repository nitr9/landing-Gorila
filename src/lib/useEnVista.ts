import { useEffect, useRef, useState } from 'react'

/**
 * Devuelve true cuando el elemento entra en pantalla. Una sola vez: una vez
 * visto, no vuelve a false aunque se salga del viewport.
 */
export function useEnVista<T extends HTMLElement>(umbral = 0.35) {
  const ref = useRef<T>(null)
  const [enVista, setEnVista] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setEnVista(true)
        observador.disconnect()
      },
      { threshold: umbral }
    )

    observador.observe(el)
    return () => observador.disconnect()
  }, [umbral])

  return { ref, enVista }
}
