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

Los videos se generan en **Google Flow (Veo)**, que entrega **1280x720**.

### Cómo conseguir el 4K

El 4K no sale del generador: es un paso posterior de **"Upscale"** dentro de
Flow, sobre el video ya generado. Dos cosas a tener en cuenta:

1. **Suele estar atado al plan.** En AI Pro puede no aparecer; normalmente
   requiere Ultra.
2. **Al descargar hay que elegir la versión escalada.** Bajar desde la vista
   previa da el 720p aunque el upscale se haya hecho.

No escalar el 720p por nuestra cuenta: inventa píxeles, pesa diez veces más y
se ve más blando, no más nítido.

### El problema de los cuatro paneles

Hay una causa de la baja definición más importante que la resolución global:
la composición son **cuatro paneles verticales**, así que cada panel mide solo
**310 px de ancho** y en pantalla se estira a 360 px o más.

Al regenerar en Flow conviene pedir **una sola escena a pantalla completa** en
lugar de paneles divididos. Los mismos 1280 px puestos en una sola imagen
rinden cuatro veces más que repartidos en cuatro columnas.

### Al traer un video nuevo

Necesita siempre el mismo tratamiento: quitarle la pista de audio y armar el
ping-pong (comando más abajo), porque las tomas de Flow terminan en un
encuadre distinto al que arrancan y el loop directo salta.
