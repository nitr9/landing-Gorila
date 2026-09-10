# NT® — Con los auriculares puestos

Landing de **NT®**, una marca ficticia de auriculares. Es un ejercicio de
diseño y de marca personal: no hay producto real detrás.

**En vivo:** https://landing-gorila.netlify.app

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui

## Empezar

```bash
npm install     # una sola vez
npm run dev     # servidor de desarrollo → http://localhost:5173
npm run build   # build de producción → dist/
npm run preview # previsualizar el build
npm run lint    # chequeo de tipos
```

> **Al clonar, la página carga sin videos ni música.** `public/video/` y
> `public/audio/` están en `.gitignore` a propósito — ver
> [notas/ESTADO.md](notas/ESTADO.md) para el origen de cada archivo.

## El recorrido

Cuatro bloques encadenados sin costura visible, todos sobre el mismo verde:

| # | Sección | Qué pasa |
|---|---|---|
| 1 | `VideoPanel` + `Hero` | Gorila de perfil en loop, texto a la izquierda |
| 2 | `Interludio` | Respiración: "No es la ausencia de sonido" |
| 3 | `ScrollStory` | El scroll controla el giro del gorila |
| 4 | `Transicion` + `Cierre` | Puente y remate sobre el soporte |

Más el `Reproductor` fijo abajo a la izquierda: siete barras que reaccionan
al audio real vía `AnalyserNode`.

## Estructura

```
src/
├── components/
│   ├── ui/button.tsx        Botón shadcn con variante "glass"
│   ├── ui/text-animate.tsx  Texto letra por letra (cult-ui, adaptado)
│   ├── Hero.tsx  Navigation.tsx  Logo.tsx  VideoPanel.tsx
│   ├── Interludio.tsx  ScrollStory.tsx  Transicion.tsx  Cierre.tsx
│   ├── Estelas.tsx          Estelas de luz reactivas al audio
│   └── Reproductor.tsx      Audio local + análisis de frecuencias
├── lib/
│   ├── audio.tsx            Contexto de audio compartido
│   ├── useEnVista.ts        Hook de entrada en viewport
│   └── utils.ts             Helper cn()
├── App.tsx  index.css  main.tsx

public/          favicon, img/ (posters) — video/ y audio/ NO van al repo

notas/
├── ESTADO.md      Dónde estamos hoy
├── DECISIONES.md  Por qué las cosas son como son
└── CONTEXTO.md    Cómo trabajamos
```

## Personalizar

- **Colores:** variables HSL en `:root` dentro de `src/index.css`
- **Tipografías:** se importan desde `index.html`

## Desplegar

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

**El deploy es manual a propósito.** El repo no está conectado a Netlify
para builds automáticos: como el video y el audio no van a Git, un build
hecho por Netlify desde GitHub daría una landing sin material. Subir el
`dist` armado en local es lo que garantiza que los 38 MB lleguen.

Por lo mismo, **un push a GitHub no actualiza el sitio.**

La configuración del hosting está en [netlify.toml](netlify.toml). Falta
agregarle las **cabeceras de seguridad** — ver la sección de seguridad en
[notas/ESTADO.md](notas/ESTADO.md).
