# Contexto para Claude

Brief de arranque para cualquier sesión nueva. Si estás leyendo esto por
primera vez en esta sesión, seguí el orden de abajo antes de tocar código.

---

## Qué es esto

Landing de una sola página para **NicoNT®**. Es un ejercicio de diseño, no un
encargo de cliente: la vara es estética, no de negocio.

La tesis que sostiene todo: **el silencio es donde se trabaja**. Lo bueno se
hace en soledad, sin público y sin validación. El slogan "Where dreams rise
through the silence" es una afirmación sobre cómo se hace el trabajo
creativo, no una frase decorativa.

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind + shadcn/ui.
El detalle de comandos y estructura está en [README.md](../README.md).

---

## Leer antes de tocar nada

1. **[notas/ESTADO.md](ESTADO.md)** — dónde estamos hoy y qué está bloqueando
2. **[notas/DECISIONES.md](DECISIONES.md)** — por qué las cosas son como son,
   incluidos los caminos que ya se descartaron
3. **[ideas/IDENTIDAD.md](../ideas/IDENTIDAD.md)** — tesis, arco narrativo y
   los textos de las secciones que faltan

Antes de proponer algo que parezca una mejora obvia, chequear DECISIONES.md:
varias cosas que se ven raras son deliberadas y ya tienen un porqué escrito.

---

## Cómo trabajamos

**Idioma:** español, con acentos y ortografía correcta. Los términos
técnicos y los identificadores de código quedan en su forma original.

**Commits:** infinitivo en español, sin prefijos tipo `feat:` ni `fix:`.
Describen el efecto, no el archivo tocado.

> Reemplazar el video del hero por la toma nueva
> Documentar el flujo de 4K en Google Flow y el problema de los cuatro paneles

**Los textos de la página van en inglés.** El código y la documentación en
español; el copy que ve el visitante, en inglés. No traducir el copy.

**Al cierre de cada sesión:** actualizar [ESTADO.md](ESTADO.md) — fecha,
commit de referencia, estado del bloqueante y pendientes que se hayan movido.
Si en la sesión se decidió algo con un porqué que no se deduce del código,
agregarlo a [DECISIONES.md](DECISIONES.md).

**Commits y push:** solo cuando se piden explícitamente.

---

## Reglas duras

Estas no se discuten sin una conversación previa. El porqué de cada una está
en [DECISIONES.md](DECISIONES.md).

- **Nada de overlays oscuros sobre el video.** El contraste se resuelve en el
  texto, nunca oscureciendo la imagen.
- **Todo video nuevo necesita el mismo tratamiento:** quitarle el audio y
  armar el loop ping-pong. Sin eso, el loop salta.
- **No escalar videos por nuestra cuenta.** El upscale se hace en Flow o no
  se hace.
- **`originales/` no entra al repo.** Está en `.gitignore` y ahí viven los
  clips crudos.
- **La sección 3 no dice "y triunfaste", dice "y otra vez".**

---

## Convenciones de código

- **Imports con alias `@/`** — `@/components/...`, `@/lib/utils`
- **Componentes con `export function`**, no `export default`
  (la única excepción es `App.tsx`)
- **Clases de Tailwind ordenadas** como las deja el formateador; para
  combinarlas condicionalmente se usa el helper `cn()` de `@/lib/utils`
- **Las tipografías se aplican inline** con `style={{ fontFamily }}` para
  Instrument Serif, porque conviven con las clases de Tailwind
- **Los blancos con opacidad** (`text-white/70`, `text-white/80`) reemplazan a
  `muted-foreground` sobre el video — el gris del tema desaparece sobre las
  nubes claras
- **Listas de contenido como constantes arriba del componente**, en
  mayúsculas — el patrón de `NAV_LINKS` en `Navigation.tsx`

---

## Dónde está cada cosa

| Carpeta | Qué hay | Al repo |
|---|---|---|
| `src/` | El código de la página | Sí |
| `notas/` | Estado, decisiones y este archivo | Sí |
| `ideas/` | Identidad y componentes escritos pero no montados | Sí |
| `originales/` | Clips crudos de Flow y versiones previas del hero | **No** |
| `public/` | `video/hero.mp4`, `img/hero-poster.jpg`, favicon | Sí |
| `dist/` | Build | **No** |

Los componentes de `ideas/` (`Section.tsx` y `Story.tsx`) están terminados y
esperando video. Para montarlos: moverlos a `src/components/` y agregar
`<Story />` después del hero en `App.tsx`.
