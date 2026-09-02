# Decisiones y notas de trabajo

Por qué las cosas son como son. Incluye lo que se probó y no funcionó, que
suele ser más útil que lo que sí: evita repetir el intento.

Se le agrega al final a medida que aparecen decisiones nuevas; no se
reescribe. Si algo de acá deja de ser cierto, marcarlo como revertido y
explicar por qué, en vez de borrarlo.

---

## El loop ping-pong del video

**Qué:** `public/video/hero.mp4` es el clip de 10s seguido de sí mismo
invertido — 20s en total.

**Por qué:** el original terminaba con las manos casi tocándose y arrancaba
con ellas separadas. Al reiniciar, saltaban hacia atrás de golpe. Yendo y
volviendo, el último fotograma es idéntico al primero y el empalme
desaparece.

**Lo que importa:** dejó de ser un arreglo técnico. Las manos que se acercan
y se separan sin resolverse nunca *son* la tesis — el ciclo se repite y no se
cierra. Las manos que casi se tocan son la Creación de Adán recortada justo
antes del contacto: no es la unión, es la inminencia.

Si se cambia el video, conservar el gesto. El comando de ffmpeg está en el
README, sección "El loop del video"; el `trim=start_frame=1` evita que el
fotograma del medio quede duplicado.

---

## Nada de overlays sobre el video

**Qué:** el contraste del texto se resuelve con la clase `.text-over-video`
(una sombra) y blancos con opacidad, nunca con una capa oscura encima del
video.

**Por qué:** el prompt original lo pedía explícitamente, y la razón se
sostiene sola — un overlay apaga los colores del video, que son lo mejor que
tiene. La sombra da contraste sin tocar la imagen.

**Corolario:** los textos usan `white/70` y `white/80` en vez de
`muted-foreground`. El gris azulado del tema (`240 4% 66%`) desaparece sobre
las zonas claras del video, las nubes doradas y rosas. El blanco con opacidad
conserva la jerarquía visual y se lee sobre cualquier fondo.

---

## Video local en vez de la URL de CloudFront

El prompt original apuntaba a un video externo. Se usa `public/video/hero.mp4`
en su lugar: no depende de un servidor ajeno y carga más rápido.

---

## Silenciar el video por JS, no solo por atributo

En `VideoBackground.tsx` se fuerza `muted` antes de reproducir, además del
atributo en el elemento.

**Por qué:** si el atributo llega tarde, el navegador bloquea el autoplay en
lugar de reproducir con sonido. El archivo además no tiene pista de audio.

---

## La baja definición son los cuatro paneles, no la resolución

**El hallazgo:** Flow entrega 1280x720, pero el problema real es la
composición. Son cuatro paneles verticales, así que cada panel usa apenas
**310 px de ancho** y en pantalla se estira a 360 px o más.

**La consecuencia:** una sola escena a pantalla completa con los mismos
1280 px se ve cuatro veces más nítida. El 4K puede no ser necesario.

**Lo que no hay que hacer:** escalar el 720p por nuestra cuenta. Inventa
píxeles, pesa diez veces más y se ve más blando, no más nítido. El upscale
se hace dentro de Flow o no se hace.

**Sobre el 4K en Flow:** no sale del generador, es un paso posterior de
"Upscale" sobre el video ya generado. Suele estar atado al plan (AI Pro puede
no tenerlo, normalmente requiere Ultra), y al descargar hay que elegir la
versión escalada — bajar desde la vista previa da el 720p aunque el upscale
se haya hecho.

---

## Las secciones se sacaron de la página

**Qué:** las secciones 2 y 3 estaban montadas y se retiraron. Los componentes
quedaron guardados en `ideas/` (`Section.tsx` y `Story.tsx`), terminados.

**Por qué:** usaban recortes del video del hero como imágenes fijas. Con
310 px de ancho por panel, estirado a media pantalla ya se nota blando y a
pantalla completa se pixela. Hacen falta piezas generadas a su propia
resolución.

**Estado:** esperando video propio para cada una — azul noche con nubes rosas
para la sección 2, el pasaje a dorado para la 3.

---

## El cierre es "y otra vez", no "y triunfaste"

La sección 3 (el amanecer) no debe leerse como una recompensa. El amanecer no
es la meta: es el intervalo antes de la siguiente noche.

> Then the light fades, and the silence returns, and there is more to make.
> That is not the price of the work. That is the work.

Esto va a contramano de la cultura de mostrar el proceso en vivo, y ese
contraste es lo que le da filo. Es la decisión editorial más fácil de
arruinar sin darse cuenta al reescribir el copy.

---

## De Velorah a NicoNT

El logo y el título cambiaron a **NicoNT®** (`Navigation.tsx` e `index.html`).

**Migración incompleta:** `package.json` sigue con `"name":
"velorah-landing"` y el README titula "Velorah®". Está anotado como pendiente
en [ESTADO.md](ESTADO.md).

---

## Lo que se probó y no funcionó

| Intento | Por qué falló |
|---|---|
| Recortar los paneles del hero como imágenes para las secciones 2 y 3 | 310 px de ancho: blando a media pantalla, pixelado a pantalla completa |
| Loop directo del clip de Flow | Termina en un encuadre distinto al que arranca; el reinicio salta |
| `muted-foreground` para el texto sobre el video | El gris del tema desaparece sobre las nubes claras |
| Escalar el 720p localmente | Inventa píxeles, pesa mucho más, se ve más blando |
