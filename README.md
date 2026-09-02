# Velorah® — Landing

Hero de una sola página con video de fondo, navegación glassmorphic y
tipografía cinematográfica.

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui

## Estado (2 de septiembre de 2026)

Funcionando: el hero completo, con video en loop sin corte y texto legible
sobre todas las zonas del video. Verificado en escritorio, tablet y móvil.
Guardado en git (commit inicial `cae72a0`).

**Para retomar:** `npm run dev` y abrir http://localhost:5173/

Lo próximo son las secciones 2 y 3 (noche y amanecer). La identidad, el arco
narrativo y los textos ya están definidos en [ideas/IDENTIDAD.md](ideas/IDENTIDAD.md);
falta generar un video propio para cada una — a pantalla completa, no como
panel dividido, porque los paneles del hero miden 310px y se pixelan al ampliarlos.

## Comandos

```bash
npm install     # una sola vez
npm run dev     # servidor de desarrollo → http://localhost:5173
npm run build   # build de producción → dist/
npm run preview # previsualizar el build
npm run lint    # chequeo de tipos
```

## Estructura

```
src/
├── components/
│   ├── ui/button.tsx        Botón shadcn con variante "glass"
│   ├── Hero.tsx             Titular, subtexto y CTA
│   ├── Navigation.tsx       Logo, links y CTA
│   └── VideoBackground.tsx  Video fullscreen con autoplay
├── lib/utils.ts             Helper cn()
├── App.tsx
├── index.css                Tema, liquid-glass y animaciones
└── main.tsx

public/
├── video/hero.mp4           Video del hero (calidad original, sin audio)
└── img/hero-poster.jpg      Poster
```

## Decisiones que se apartan del prompt original

**Video local en vez de la URL de CloudFront.** Se usa `public/video/hero.mp4`
(el video de nubes ya procesado) en lugar del enlace externo del prompt. No
depende de un servidor ajeno y carga más rápido.

**Texto en `white/70` y `white/80` en vez de `muted-foreground`.** El gris
azulado del tema (`240 4% 66%`) desaparece sobre las zonas claras del video —
las nubes doradas y rosas. El blanco con opacidad conserva la misma jerarquía
visual pero se lee sobre cualquier fondo.

**Clase `.text-over-video`.** Sombra de texto que da contraste sin oscurecer
el video ni alterar sus colores. El prompt pedía explícitamente no usar
overlays, así que el contraste se resuelve en el texto, no sobre la imagen.

**Video silenciado por JS además del atributo.** En `VideoBackground.tsx` se
fuerza `muted` antes de reproducir. Sin esto, si el atributo llega tarde, el
navegador bloquea el autoplay en lugar de reproducir con sonido. El archivo
además no tiene pista de audio.

## Personalizar

- **Colores:** variables HSL en `:root` dentro de `src/index.css`
- **Tipografías:** `--font-display` (Instrument Serif) y `--font-body` (Inter),
  importadas desde Google Fonts en `index.html`
- **Textos y links:** `Hero.tsx` y el array `NAV_LINKS` de `Navigation.tsx`

## Pendientes

- [ ] Secciones 2 y 3 (noche y amanecer) — ver `ideas/IDENTIDAD.md`
- [ ] Conectar los links de navegación (hoy todos apuntan a `#`)
- [ ] Definir la acción del botón "Begin Journey"
- [ ] Menú móvil (los links se ocultan bajo `md:` y no hay hamburguesa)
- [ ] Imagen Open Graph para redes

## Archivos fuente

`originales/` no entra al build ni al repo (está en .gitignore):

- `Necesito_que_las_nubes_tengan.mp4` — el video tal como se descargó, con audio
- `hero-sin-pingpong.mp4` — el clip de 10s limpio, antes de armar el loop

### El loop del video

`public/video/hero.mp4` es una versión **ping-pong**: el clip de 10s seguido
de sí mismo invertido, 20s en total.

El original terminaba con las manos casi tocándose y arrancaba con ellas
separadas, así que al reiniciar saltaban hacia atrás de golpe. Yendo y
volviendo, el último fotograma es idéntico al primero y el empalme
desaparece. Las manos se acercan y se separan en un vaivén continuo.

Para regenerarlo desde otro clip:

```bash
ffmpeg -i entrada.mp4 -filter_complex   "[0:v]split[a][b];[b]reverse,trim=start_frame=1[r];[a][r]concat=n=2:v=1[out]"   -map "[out]" -an -c:v libx264 -preset slow -crf 20   -pix_fmt yuv420p -movflags +faststart public/video/hero.mp4
```

El `trim=start_frame=1` evita que el fotograma del medio quede duplicado.

## Resolución del video

El video es 1280x720 nativo, la resolución en la que se generó. No hay una
versión de más calidad que recuperar: escalarlo a 4K solo inventaría píxeles,
pesaría diez veces más y se vería más blando, no más nítido.

Lo que sí se hizo: regenerarlo con CRF 15 (bitrate 2.780 kbps, por encima
del original de 2.149) para que el ping-pong no agregue pérdida propia.

Si conseguís el clip en 4K desde donde lo generaste, traelo: se rehace el
ping-pong desde ese archivo y se sirve a 1440p o 1080p, que es lo razonable
para un video de fondo.
