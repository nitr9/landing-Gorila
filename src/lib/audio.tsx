import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/**
 * Estado del audio compartido entre componentes.
 *
 * El reproductor es el único que crea el AnalyserNode (el AudioContext
 * necesita un gesto del usuario), pero las estelas también necesitan leerlo
 * para vibrar con la música. En vez de duplicar el análisis, se comparte el
 * nodo por contexto y cada quien lee cuando lo necesita.
 */
type EstadoAudio = {
  sonando: boolean
  setSonando: (v: boolean) => void
  registrarAnalizador: (a: AnalyserNode | null) => void
  /** Nivel actual de 0 a 1. Devuelve 0 si no hay audio sonando. */
  leerNivel: () => number
  /** Energía de los graves y de los medios, para detectar percusión. */
  leerBandas: () => { graves: number; medios: number }
}

const Contexto = createContext<EstadoAudio | null>(null)

export function ProveedorAudio({ children }: { children: ReactNode }) {
  const [sonando, setSonando] = useState(false)
  const analizadorRef = useRef<AnalyserNode | null>(null)
  const bufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  const registrarAnalizador = useCallback((a: AnalyserNode | null) => {
    analizadorRef.current = a
  }, [])

  const leerNivel = useCallback(() => {
    const analizador = analizadorRef.current
    if (!analizador) return 0

    if (
      !bufferRef.current ||
      bufferRef.current.length !== analizador.frequencyBinCount
    ) {
      bufferRef.current = new Uint8Array(analizador.frequencyBinCount)
    }
    const datos = bufferRef.current
    analizador.getByteFrequencyData(datos)

    // Promedio de los graves: es lo que marca el pulso de la música.
    let suma = 0
    const bandas = Math.min(8, datos.length)
    for (let i = 0; i < bandas; i++) suma += datos[i]
    return suma / bandas / 255
  }, [])

  // El bombo vive en los graves y el redoblante en los medios: se leen por
  // separado para poder detectar cada golpe.
  const leerBandas = useCallback(() => {
    const analizador = analizadorRef.current
    if (!analizador) return { graves: 0, medios: 0 }

    if (
      !bufferRef.current ||
      bufferRef.current.length !== analizador.frequencyBinCount
    ) {
      bufferRef.current = new Uint8Array(analizador.frequencyBinCount)
    }
    const datos = bufferRef.current
    analizador.getByteFrequencyData(datos)

    let graves = 0
    for (let i = 1; i < 5; i++) graves += datos[i]
    graves = graves / 4 / 255

    let medios = 0
    const desde = Math.floor(datos.length * 0.18)
    const hasta = Math.floor(datos.length * 0.42)
    for (let i = desde; i < hasta; i++) medios += datos[i]
    medios = medios / (hasta - desde) / 255

    return { graves, medios }
  }, [])

  const valor = useMemo(
    () => ({ sonando, setSonando, registrarAnalizador, leerNivel, leerBandas }),
    [sonando, registrarAnalizador, leerNivel, leerBandas]
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAudio() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useAudio necesita estar dentro de ProveedorAudio')
  return ctx
}
