# Estado del proyecto

**Última actualización:** 10 de septiembre de 2026
**Rama:** `main`

**En vivo:** https://landing-gorila.netlify.app

Dónde estamos hoy: qué está listo y qué sigue. Es lo único de `notas/` que
cambia cada sesión.

- [CONTEXTO.md](CONTEXTO.md) — cómo trabajamos y qué leer primero
- [DECISIONES.md](DECISIONES.md) — por qué las cosas son como son
- [README.md](../README.md) — comandos y estructura

---

## Qué es

Landing de **NT®**, una marca ficticia de auriculares. Es un ejercicio de
diseño y de marca personal: no hay producto real detrás.

El recorrido son cuatro bloques encadenados sin costura visible, todos sobre
el mismo verde:

| # | Sección | Qué pasa |
|---|---|---|
| 1 | `VideoPanel` + `Hero` | Gorila de perfil en loop, texto a la izquierda |
| 2 | `Interludio` | Respiración: "No es la ausencia de sonido" |
| 3 | `ScrollStory` | El scroll controla el giro del gorila; tres frases alternan izquierda/derecha |
| 4 | `Transicion` + `Cierre` | Puente y remate: los auriculares se posan en el soporte |

La transición lleva **estelas de luz** cruzando el fondo —el rastro de los
faros en una foto de larga exposición— que tiemblan con el golpe de la
batería cuando hay música. Su frase se arma letra por letra desde abajo, con
`TextAnimate` (`calmInUp`).

Y el `Reproductor` fijo abajo a la izquierda: siete barras que reaccionan al
audio real, con control de volumen que aparece al reproducir. Es el único
que crea el `AudioContext`; las estelas leen su análisis por contexto
(`src/lib/audio.tsx`).

```bash
npm install
npm run dev     # → http://localhost:5173
```

---

## Lo que falta

- [ ] **Los links no llevan a ningún lado.** `Sonido`, `Diseño` y `Acerca de`
      apuntan a `#`, igual que los dos botones "Explorar audífonos".
- [ ] **No hay menú móvil.** La navegación se oculta bajo `sm:` y el
      reproductor bajo `sm:` también.
- [ ] **El scrubbing está desactivado en móvil** (queda el poster fijo). Es
      deliberado —en un teléfono iría a los saltos— pero se podría resolver
      con una secuencia de imágenes.
- [x] ~~Imagen Open Graph~~ — usa el poster del hero.
- [ ] El interludio (sección 2) no tiene animación de entrada. El hook
      [useEnVista](../src/lib/useEnVista.ts) ya se usa en `Transicion`, así
      que el patrón está resuelto: falta aplicarlo acá.
- [x] ~~El `<title>` decía "Vanta — Serie 01"~~ — corregido, con Open Graph.

---

## Seguridad

Repaso hecho el 3 de septiembre de 2026 sobre el código: **sin hallazgos**.
No hay sinks de XSS, secretos, llamadas de red ni almacenamiento, y
`npm audit` da 0 vulnerabilidades. El detalle y el porqué están en
[DECISIONES.md](DECISIONES.md).

Lo que queda abierto está **fuera del código**:

- [x] ~~**Cabeceras de seguridad**~~ — HECHO el 10/9/2026, en `netlify.toml`:
      CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy` y
      `Permissions-Policy`. HSTS lo pone Netlify solo.

      **La CSP está medida contra el sitio, no copiada de una plantilla.**
      `style-src` lleva `'unsafe-inline'` porque la página tiene **70
      elementos con atributo `style=`** —las animaciones— y sin eso no
      renderiza nada; es la única concesión. Probado sirviendo el `dist`
      real con las cabeceras puestas: **cero violaciones de CSP, cero errores
      de JS**, los videos cargan y la tipografía se aplica.

      **Ojo: todavía no están en vivo.** El deploy es manual, así que salen
      recién cuando se suba el próximo `dist`.
- [ ] **Autoalojar las fuentes de Google.** Es la única dependencia externa
      en tiempo de ejecución que queda; sacarla también acelera la carga.
- [ ] **Fijar las versiones de las dependencias** (quitar los `^`). Es la
      defensa contra cadena de suministro, el riesgo más realista del
      proyecto.

## Pendiente técnico

- [ ] **`.git` pesa ~22 MB** por los videos del proyecto anterior, que
      quedaron en el historial. Se recuperan reescribiéndolo, pero eso
      destruye el punto de retorno (`7ea9351`).

---

## Los archivos pesados no están en el repo

`public/video/` y `public/audio/` están en `.gitignore`. Al clonar, la
página carga pero **sin videos ni música**. Los originales están en la
carpeta de Descargas de Nico:

| Archivo del proyecto | Origen |
|---|---|
| `video/gorila.mp4` | `Gorila_gira_la_cabeza_1080p_*.mp4` |
| `video/gorila-scroll.mp4` | `Gorila_ajustando_audífonos_rojos_1080p_*.mp4` |
| `video/producto.mp4` | `Gorilla_places_red_wireless_head…*.mp4` |
| `audio/ambiente.mp3` | `wav-session-22--old-school-hip-hop-mix--20-tracks.mp3` |

El tratamiento de cada uno está en [DECISIONES.md](DECISIONES.md).

---

## Deploy

La landing está en vivo en **https://landing-gorila.netlify.app**
(Netlify, proyecto `landing-gorila`, equipo Nicolas). Publicada el 10 de
septiembre de 2026.

Para actualizar el sitio:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

**Es a mano, y tiene que serlo.** El repo no conecta a Netlify para builds
automáticos: como el video y el audio no están en Git (ver la sección de
arriba), un build hecho por Netlify desde GitHub daría una landing sin
material. Subir el `dist` armado en local es lo que garantiza que los 38 MB
lleguen. El porqué completo y las alternativas descartadas están en
[DECISIONES.md](DECISIONES.md).

Consecuencia: **un push a GitHub no actualiza el sitio.**

La configuración vive en [netlify.toml](../netlify.toml): redirect de SPA y
cache de assets (`immutable` para `/assets/*`, que llevan hash en el nombre;
una semana para video, audio e imágenes).

### Pendiente del deploy

- [ ] **El video del hero pesa 17,8 MB** (`gorila-scroll.mp4`) y se sirve
      desde el mismo origen. En una conexión lenta es una espera larga justo
      en la primera impresión. Comprimirlo o cargarlo en dos etapas.
- [ ] **Escribir las cabeceras de seguridad** en `netlify.toml` (ver la
      sección de Seguridad).
