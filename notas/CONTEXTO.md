# Contexto para Claude

Brief de arranque para cualquier sesión nueva. Si estás leyendo esto por
primera vez en esta sesión, seguí el orden de abajo antes de tocar código.

---

## Qué es esto

La landing de **NT®**, una marca ficticia de auriculares: un ejercicio de
diseño y de marca personal, sin producto real detrás.

Stack: **React 18 + Vite 6 + TypeScript + Tailwind + shadcn/ui**. El
recorrido son cuatro secciones encadenadas sin costura visible, con video,
scroll que controla la imagen y un reproductor de audio que alimenta las
animaciones. El detalle está en [ESTADO.md](ESTADO.md).

---

## Leer antes de tocar nada

1. **[notas/ESTADO.md](ESTADO.md)** — dónde estamos hoy y qué falta
2. **[notas/DECISIONES.md](DECISIONES.md)** — por qué las cosas son como son,
   incluidos los caminos que ya se descartaron

Antes de proponer algo que parezca una mejora obvia, chequear DECISIONES.md:
varias cosas que se ven raras son deliberadas y ya tienen un porqué escrito.

---

## Cómo trabajamos

**Idioma:** español, con acentos y ortografía correcta. Los términos
técnicos y los identificadores de código quedan en su forma original.

**Commits:** infinitivo en español, sin prefijos tipo `feat:` ni `fix:`.
Describen el efecto, no el archivo tocado.

> Vaciar el proyecto para empezar de nuevo
> Documentar el flujo de 4K en Google Flow y el problema de los cuatro paneles

**Commits y push:** solo cuando se piden explícitamente.

**Antes de borrar algo irreversible:** avisar qué no está en git y confirmar.
El 2 de septiembre se perdieron seis clips crudos que estaban en
`.gitignore`; fue una decisión tomada a conciencia, pero conviene que
siempre lo sea.

**Al cierre de cada sesión:** actualizar [ESTADO.md](ESTADO.md) — fecha,
commit de referencia y qué cambió. Si se decidió algo con un porqué que no se
deduce del código, agregarlo a [DECISIONES.md](DECISIONES.md).

---

## Reglas duras

El porqué de cada una está en [DECISIONES.md](DECISIONES.md).

- **Los videos no se commitean.** `public/video/` está en `.gitignore`: lo
  que entra al historial se queda ahí para siempre, aunque después se borre.
- **Todo video de fondo necesita tratamiento:** quitarle el audio y armar el
  loop ping-pong. Sin eso, el loop salta.
- **No escalar videos por cuenta propia.** El upscale se hace en el
  generador o no se hace.
- **Nada de secretos en el código.** La landing es estática y no tiene
  APIs; si alguna vez entra una, ojo con Vite: toda variable `VITE_` queda
  incrustada en el JavaScript público y la ve cualquiera.
- **El espacio en disco es limitado.** No dejar builds ni artefactos
  acumulados; `node_modules` y `dist` se borran sin miedo y se regeneran.

---

## Convenciones de código

- **Imports con alias `@/`** — `@/components/...`, `@/lib/utils`
- **Componentes con `export function`**, no `export default`
  (la única excepción es `App.tsx`)
- **Clases de Tailwind** combinadas condicionalmente con el helper `cn()` de
  `@/lib/utils`
- **Las tipografías se aplican inline** con `style={{ fontFamily }}` cuando
  conviven con clases de Tailwind
- **Listas de contenido como constantes en mayúsculas** arriba del
  componente, no incrustadas en el JSX

---

## Dónde está cada cosa

| Carpeta | Qué hay | Al repo |
|---|---|---|
| `src/` | El código de la página | Sí |
| `notas/` | Estado, decisiones y este archivo | Sí |
| `public/` | Favicon y `img/` (posters de los videos) | Sí |
| `public/video/`, `public/audio/` | Videos y música | **No** |
| `node_modules/`, `dist/` | Dependencias y build | **No** |
