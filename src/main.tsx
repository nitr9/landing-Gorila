import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

/*
 * Al recargar, el navegador devuelve el scroll a donde estaba. Acá molesta:
 * el bloque de scrollytelling quedaría a mitad del giro y la página abriría
 * por el medio. Se fuerza el arranque desde arriba.
 */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
