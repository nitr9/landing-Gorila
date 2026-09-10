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

## Video y scroll: lo aprendido con el gorila

### Ralentizar un video lo traba

Ni `playbackRate = 0.7` ni estirar los tiempos con `setpts` generan
fotogramas nuevos: estiran los que hay. Cada fotograma dura más en pantalla
y el movimiento se ve a saltos, por más que el archivo diga 48 o 60 fps.

**Regla:** si un clip tiene que ir más lento, se genera más lento en el
origen. Un clip de 24 fps y 240 fotogramas no se puede estirar sin que se
note.

### `minterpolate` inventa fotogramas, pero deforma los bordes

El filtro de interpolación de movimiento sí crea fotogramas intermedios, y
funciona bien con movimiento continuo y previsible — el giro lento del
gorila, por ejemplo.

**Falla cuando algo entra rápido en cuadro:** no tiene información de dónde
venía y deforma los píxeles. En el clip del producto, la mano que entra
generaba artefactos visibles. Ahí hubo que sacarlo.

### Scrubbing: controlar la velocidad, no saltar a un `currentTime`

Buscar un tiempo exacto en cada evento de scroll obliga al navegador a
decodificar de a saltos y ahí aparecen los tirones. Lo que funciona es
dejar el video reproduciéndose y **modular `playbackRate`** según la
distancia al objetivo: rápido si falta mucho, frenando al acercarse, en
pausa al llegar. El decodificador trabaja en secuencia, que es lo que sabe
hacer.

Hacia atrás no hay reproducción posible: ahí sí hay que saltar, pero de a
pasos cortos (18% de la distancia) para que no se note.

Requisito del archivo: **keyframe cada 2 frames** (`-g 2 -keyint_min 2
-sc_threshold 0`). Sin eso, cualquier método da tirones.

### El poster es el primer fotograma, no el último

Si el video arranca al entrar en pantalla, el poster tiene que coincidir con
su primer fotograma. Con el último, se ve la escena terminada un instante y
después el video "vuelve a empezar" — parece un bug y no lo es.

---

## Fusionar secciones sin costura

El objetivo era que las cuatro secciones se leyeran como una sola pieza. Lo
que funcionó:

1. **Ninguna sección lleva fondo propio:** todas heredan el verde del body.
2. **El color del fondo sale de muestrear el video**, no de elegirlo a ojo.
3. **Los bordes de cada video se funden** con degradados hacia el fondo.

### Toda capa que corta en seco deja una línea

Esta fue la causa de casi todos los cortes visibles, y costó verla porque el
síntoma aparece lejos de la causa:

- El degradado lateral del hero llegaba hasta el piso → su borde se sumaba
  al del video. Se arregla con una máscara que lo apaga antes.
- El velo `bg-black/25` del `ScrollStory` terminaba con el bloque `sticky` →
  línea horizontal a media pantalla. Misma solución.
- Una sección con fondo opaco y `z-index` mayor tapa el degradado de la
  anterior y lo anula por completo.

**Regla:** si una capa se superpone a un video, tiene que desvanecerse antes
de su propio borde.

### Un color plano no empalma con un fondo viñeteado

El video del cierre tiene el fondo más claro en el centro (34%) que en los
bordes (30%). Ningún color sólido puede coincidir con las dos zonas, así que
siempre quedaba escalón en alguna.

**La solución no es afinar el color:** es enmascarar el borde del propio
video para que se disuelva sobre lo que haya detrás, sea cual sea su tono.

---

## Verificar en el navegador, no en el compilador

Una animación quedó "arreglada" tres veces seguidas sin estarlo. El typecheck
y el build pasaban limpios en cada intento, pero el efecto no corría.

**Dos causas se sumaron:**

1. Un script de reemplazo de texto no encontró el patrón, **no cambió nada y
   aun así reportó éxito**. Confiar en esa salida hizo perder varios ciclos.
2. Que un componente compile no dice nada sobre si su animación se ve.

**Qué hacer en su lugar:** para cualquier cosa visual o de comportamiento,
abrir la página en un navegador real y medir. Con Playwright alcanza:

```js
const t1 = await el.evaluate((e) => getComputedStyle(e).transform)
// ... esperar ...
const t2 = await el.evaluate((e) => getComputedStyle(e).transform)
```

Si los valores son iguales, no animó. También sirven las capturas en
distintos momentos de la secuencia.

**Y al editar:** preferir herramientas que fallen ruidosamente cuando el
patrón no coincide, en vez de scripts que devuelven éxito igual.

---

## TextAnimate: qué hubo que cambiarle

El componente de cult-ui (`motion`, no `framer-motion`) sirve, pero tal como
viene no funcionaba acá:

- **Animaba al montar**, así que en una sección a mitad de página el efecto
  ya había ocurrido cuando se llegaba. Ahora dispara con `useInView`.
- **Traía tipografía y colores fijos** (`font-black`, `text-black`) ajenos al
  proyecto. Se sacaron para que las clases las ponga quien lo usa.
- **El recorte fallaba con más de una línea.** Las variantes que suben desde
  abajo (`calmInUp`, `whipInUp`, `shiftInUp`) mueven las letras con
  `y: '200%'` y dependen de un único `overflow: hidden` en el contenedor. Con
  texto en dos líneas eso no recorta bien y las letras quedan desplazadas en
  vez de emerger: **cada letra necesita su propia máscara**.

El registro de cult-ui está detrás de un checkpoint de Vercel que devuelve
429 a peticiones automatizadas, así que el CLI de shadcn no puede bajarlo:
hay que traer el JSON desde el navegador.

---

## Spotify no sirve si se quiere ocultar la interfaz

El iframe de Spotify no se puede controlar por JavaScript (política de
origen cruzado), así que oculto no hay forma de darle play — requiere que la
persona apriete su botón, dentro del iframe.

Por eso el reproductor usa **audio local**: las barras además reaccionan al
sonido real con `AnalyserNode`, en vez de animarse por CSS.

El `AudioContext` necesita un gesto del usuario, así que el analizador se
crea recién en el primer play, no al montar el componente.

---

## Los videos no se commitean

**Regla:** `public/video/` y `public/audio/` están en `.gitignore`.

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

---

## Seguridad: no hay nada que cubrir, y eso es una consecuencia

**Cuándo:** 3 de septiembre de 2026.

Se hizo un repaso de seguridad sobre el código y **no apareció nada**. Vale
anotar la distinción, porque cambia qué tiene sentido hacer: no es que el
código esté bien defendido, es que **no tiene las superficies donde
normalmente se ponen las defensas**.

Lo verificado, todo limpio:

| Qué se buscó | Resultado |
|---|---|
| Sinks de XSS (`dangerouslySetInnerHTML`, `innerHTML`, `eval`…) | Ninguno |
| Secretos, claves, tokens, `VITE_`, archivos `.env` | Ninguno, tampoco en el historial |
| Llamadas de red (`fetch`, `axios`, WebSocket, `sendBeacon`) | Ninguna |
| Almacenamiento (`localStorage`, `sessionStorage`) y `postMessage` | Ninguno |
| SDKs de API en dependencias | Ninguno |
| `npm audit` (producción y desarrollo) | 0 vulnerabilidades |
| `favicon.svg` | Solo formas, sin `<script>` embebido |

**Por qué sale así:** la landing es estática. Sin backend, sin formularios,
sin sesiones, sin datos de usuario. Quien descargue el sitio entero obtiene
lo mismo que ve cualquier visitante. Los vectores clásicos —inyección,
robo de sesión, escalada de privilegios, filtración de claves— no tienen
dónde apoyarse.

**La consecuencia práctica:** esta cobertura **no es permanente, depende de
que la landing siga siendo estática**. El día que entre un formulario de
contacto, una lista de espera, analítica o un embed de terceros, aparecen de
golpe categorías de riesgo que hoy no existen — y ahí hay que revisar de
nuevo. Ojo con Vite en particular: cualquier variable con prefijo `VITE_`
queda incrustada en el JavaScript público y es visible para cualquiera.

### Lo que se decidió NO hacer

Suenan a seguridad y no aportan nada acá:

- **Ofuscar el JavaScript.** El código del cliente es público por diseño;
  solo dificulta el propio depurado.
- **Bloquear clic derecho o herramientas de desarrollo.** No detiene a
  nadie y perjudica la accesibilidad.
- **Agregar DOMPurify o similar.** No hay una sola entrada de usuario que
  sanitizar. Sumar dependencias sin una amenaza concreta **amplía** la
  superficie de ataque en vez de reducirla.

**Regla:** el refuerzo se justifica contra una amenaza concreta. Sin eso, es
peso muerto que hay que mantener.

---

## El deploy sube `dist` a mano, no se conecta el repo

**Cuándo:** 10 de septiembre de 2026.

**Qué se hizo:** la landing se publicó en Netlify, en
https://landing-gorila.netlify.app (proyecto `landing-gorila`, equipo
Nicolas). El deploy es manual: `npm run build` y después
`npx netlify deploy --prod --dir=dist`.

**Por qué manual y no automático desde GitHub:** `public/video/` y
`public/audio/` están en `.gitignore` y suman 38 MB, así que no viven en el
repo. Si Netlify construyera desde GitHub, la landing saldría sin video ni
audio: el build funcionaría y el resultado estaría roto. Subir el `dist`
armado en local es lo único que garantiza que el material pesado llegue.

**Qué se descartó:**

- **Commitear el video y el audio.** Son 38 MB que quedarían para siempre en
  el historial de Git, encima de los ~22 MB que `.git` ya arrastra del
  proyecto anterior.
- **Git LFS.** Resuelve el peso, pero hay que configurarlo en el repo y en
  Netlify, y consume cuota de ancho de banda de GitHub.

**El costo de esto:** los pushes a GitHub no actualizan el sitio. Cada
cambio necesita build local y deploy a mano. Si eso llega a molestar, la
salida no es commitear el media: es moverlo a un CDN externo (Cloudinary,
Bunny) y recién entonces conectar el repo.

**Sobre las cabeceras de seguridad:** quedaron pendientes en la auditoría
del 3 de septiembre porque dependían de dónde se publicara. Ya se sabe
dónde, así que ahora se pueden escribir en `netlify.toml` — todavía no se
hizo.
