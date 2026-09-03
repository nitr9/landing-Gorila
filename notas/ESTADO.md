# Estado del proyecto

**Última actualización:** 2 de septiembre de 2026
**Rama:** `master`

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

Más el `Reproductor` fijo abajo a la izquierda: siete barras que reaccionan
al audio real, con control de volumen que aparece al reproducir.

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
- [x] ~~El `<title>` decía "Vanta — Serie 01"~~ — corregido, con Open Graph.

---

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
