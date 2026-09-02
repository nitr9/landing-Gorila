# Estado del proyecto

**Última actualización:** 2 de septiembre de 2026
**Rama:** `master` · último commit: `52ae656`

Dónde estamos hoy: qué está bloqueando y qué sigue. Es lo único de `notas/`
que cambia cada sesión.

- [CONTEXTO.md](CONTEXTO.md) — cómo trabajamos y qué leer primero
- [DECISIONES.md](DECISIONES.md) — por qué las cosas son como son
- [README.md](../README.md) — comandos y estructura

---

## Punto de partida

El proyecto está **vacío y listo para empezar**. La landing anterior se
descartó por completo el 2 de septiembre de 2026.

Lo que hay en pantalla hoy: una página en blanco con el texto "Proyecto
nuevo". Typecheck y build verificados.

```bash
npm install     # una sola vez
npm run dev     # → http://localhost:5173
```

---

## Lo que sigue: definir el proyecto nuevo

**Nada está decidido todavía.** Falta definir de qué se trata la página:
tema, tipo de sitio, tono y si sigue siendo una landing de una sola página.

Hasta que eso esté, no hay nada que construir.

---

## Lo que quedó como base

Andamiaje funcionando, sin contenido:

| Qué | Dónde |
|---|---|
| Vite + TypeScript + Tailwind configurados | raíz |
| Tema y variables de color | `src/index.css` |
| Botón shadcn con variante `glass` | `src/components/ui/button.tsx` |
| Helper `cn()` | `src/lib/utils.ts` |
| App mínima | `src/App.tsx` |

El botón con variante glass y el tema vienen del proyecto anterior. Se
conservan porque son reusables, pero **no condicionan nada**: si el enfoque
nuevo pide otra estética, se cambian sin culpa.

---

## Pendiente técnico

- [ ] **Los 22 MB de `.git`** son los videos del proyecto viejo, que quedaron
      en el historial. Se recuperan reescribiendo el historial, pero eso
      destruye el punto de retorno (`7ea9351`). Hacerlo cuando ya no haga
      falta consultar lo anterior.

---

## Por qué las cosas son como son

Las decisiones tomadas y lo que ya se probó sin éxito están en
[notas/DECISIONES.md](DECISIONES.md).
