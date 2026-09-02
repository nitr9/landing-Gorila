# Decisiones y notas de trabajo

Por qué las cosas son como son. Incluye lo que se probó y no funcionó, que
suele ser más útil que lo que sí: evita repetir el intento.

Se le agrega al final a medida que aparecen decisiones nuevas; no se
reescribe. Si algo deja de ser cierto, marcarlo como revertido y explicar por
qué, en vez de borrarlo.

---

## Se descartó la landing anterior

**Cuándo:** 2 de septiembre de 2026.

**Qué era:** una landing de una sola página con video de nubes a pantalla
completa, navegación glassmorphic y una tesis sobre el trabajo en soledad.

**Por qué se descartó:** cambio de enfoque. La página nueva no tiene relación
con esa idea.

**Qué se borró:** los clips crudos de Flow, el video del hero y su poster,
los componentes `Hero`, `Navigation` y `VideoBackground`, la carpeta `ideas/`
con la identidad y los textos, y la clase `.text-over-video`.

**Punto de retorno:** commit `7ea9351`. Todo lo commiteado se recupera desde
ahí — **menos `originales/`**, que estaba en `.gitignore` y se perdió de
forma definitiva.

**Qué se conservó y por qué:** el andamiaje (Vite, TypeScript, Tailwind), el
tema de color, el botón con variante glass y el helper `cn()`. Son reusables
y no atan el proyecto nuevo a ninguna estética.

---

## Los videos no se commitean

**Regla:** `public/video/` está en `.gitignore`, igual que `originales/`.

**Por qué:** cada versión de un video que se commitea queda **para siempre**
en el historial de git, aunque después se borre el archivo. Así fue como
`.git` llegó a pesar 22 MB en un proyecto cuyo código pesa 60 KB.

Sacarlos después obliga a reescribir el historial, que es destructivo. Es
mucho más barato no meterlos nunca.

---

## Dónde pesa realmente un proyecto así

Medido el 2 de septiembre de 2026, cuando el proyecto ocupaba 149 MB:

| | Peso | Se regenera |
|---|---|---|
| `node_modules/` | 120 MB | `npm install` |
| `.git/` | 22 MB | no |
| `dist/` | 7,6 MB | `npm run build` |
| Código y notas | ~60 KB | no |

**La conclusión:** el código no pesa nada. Si hace falta espacio, borrar
`node_modules` y `dist` libera el 85% y se recupera con dos comandos. Lo
único que no vuelve es lo que no está en git.

---

## Aprendizajes técnicos que siguen sirviendo

Del proyecto anterior, aplicables a cualquier página con video de fondo:

**El loop de un video generado por IA salta.** Las tomas terminan en un
encuadre distinto al que arrancan. La solución es el **ping-pong**: el clip
seguido de sí mismo invertido, así el último fotograma es idéntico al
primero.

```bash
ffmpeg -i entrada.mp4 -filter_complex \
  "[0:v]split[a][b];[b]reverse,trim=start_frame=1[r];[a][r]concat=n=2:v=1[out]" \
  -map "[out]" -an -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -movflags +faststart salida.mp4
```

El `trim=start_frame=1` evita que el fotograma del medio quede duplicado.

**Silenciar el video por JS, no solo por atributo.** Si el atributo `muted`
llega tarde, el navegador bloquea el autoplay en lugar de reproducir con
sonido. Hay que forzar `video.muted = true` antes de llamar a `play()`.

**Una composición dividida en paneles desperdicia resolución.** Un video de
1280 px repartido en cuatro paneles verticales da 310 px por panel, que
estirados a pantalla se ven blandos. Al generar, pedir **una sola escena a
pantalla completa**.

**No escalar video por cuenta propia.** Inventa píxeles, pesa diez veces más
y se ve más blando, no más nítido. El upscale se hace en el generador o no se
hace.

**Los grises de tema desaparecen sobre imágenes claras.** Sobre un fondo con
zonas brillantes, `muted-foreground` se pierde. Blancos con opacidad
(`text-white/70`) mantienen la jerarquía y se leen sobre cualquier cosa.

**Para contraste sobre imagen, sombra en el texto antes que overlay.** Un
overlay oscuro apaga los colores de la imagen; una sombra en el texto da
contraste sin tocarla.

---

## Lo que se probó y no funcionó

| Intento | Por qué falló |
|---|---|
| Loop directo de un clip generado por IA | Termina en un encuadre distinto al que arranca; el reinicio salta |
| Recortar paneles de un video como imágenes de sección | 310 px de ancho: blando a media pantalla, pixelado a pantalla completa |
| `muted-foreground` para texto sobre imagen clara | El gris del tema desaparece sobre las zonas brillantes |
| Escalar un 720p localmente | Inventa píxeles, pesa mucho más, se ve más blando |
