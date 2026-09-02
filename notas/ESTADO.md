# Estado del proyecto

**Última actualización:** 2 de septiembre de 2026
**Rama:** `master` · último commit: `5269abd`

Dónde estamos hoy: qué está bloqueando y qué sigue. Es lo único de `notas/`
que cambia cada sesión.

- [CONTEXTO.md](CONTEXTO.md) — cómo trabajamos y qué leer primero
- [DECISIONES.md](DECISIONES.md) — por qué las cosas son como son
- [README.md](../README.md) — comandos, estructura y flujo de video
- [ideas/IDENTIDAD.md](../ideas/IDENTIDAD.md) — tesis, arco y textos

No repetir acá lo que ya está en esos archivos — enlazar.

---

## Dónde retomar

```bash
npm run dev     # → http://localhost:5173
```

Lo que hay en pantalla hoy: **solo el hero**. Video de fondo en loop
ping-pong, navegación glassmorphic, titular, subtexto y el botón
"Begin Journey". Verificado en escritorio, tablet y móvil.

---

## Bloqueante: la definición del video

El hero funciona, pero el video **se ve blando** y eso es lo único que impide
darlo por cerrado. La causa principal no es la resolución global sino la
composición: son cuatro paneles verticales, así que cada panel usa apenas
310 px de ancho y en pantalla se estira a 360 px o más.

Caminos, en orden de probabilidad de éxito:

1. **Regenerar en Flow como una sola escena a pantalla completa** — no como
   paneles divididos. Los mismos 1280 px concentrados en una imagen rinden
   cuatro veces más. Probablemente alcance sin necesitar 4K.
2. **Upscale dentro de Flow**, si el plan lo habilita (suele requerir Ultra,
   y hay que descargar la versión escalada, no la vista previa).
3. **Cambiar de fondo y de historia.** La identidad es adaptable: lo único
   atado a este video es el gesto de las manos que casi se tocan.

Detalle completo del flujo de Flow, el 4K y el tratamiento obligatorio de
cada video nuevo (quitar audio + armar ping-pong): README, sección
"Resolución del video".

**Decisión pendiente:** cuál de los tres caminos se toma. Todo lo demás
espera a esto, porque las secciones 2 y 3 necesitan el mismo tratamiento
visual.

---

## Después del video

Las **secciones 2 y 3** (la noche y el amanecer). El trabajo conceptual ya
está hecho —tesis, arco narrativo y textos definidos en
[ideas/IDENTIDAD.md](../ideas/IDENTIDAD.md)— y los componentes están escritos
y guardados en `ideas/` (`Section.tsx` y `Story.tsx`). Falta únicamente el
video de cada sección:

- **Sección 2 (noche):** azul noche con nubes rosas
- **Sección 3 (amanecer):** el pasaje a dorado

Para volver a montarlas: mover los dos archivos a `src/components/` y agregar
`<Story />` después del bloque del hero en `App.tsx`.

Lo que ya se intentó y no funcionó: recortar los paneles del hero como
imágenes fijas. A 310 px de ancho se pixelan. Hacen falta piezas generadas a
su propia resolución.

---

## Pendientes menores

- [ ] Conectar los links de navegación (hoy todos apuntan a `#`)
- [ ] Definir la acción del botón "Begin Journey"
- [ ] Menú móvil — los links se ocultan bajo `md:` y no hay hamburguesa
- [ ] Imagen Open Graph para redes
- [ ] `package.json` sigue con `"name": "velorah-landing"` y el README titula
      "Velorah®", pero la marca en pantalla ya es **NicoNT®**
      (`Navigation.tsx` e `index.html`). Unificar.

---

## Por qué las cosas son como son

Las decisiones tomadas y lo que ya se probó sin éxito están en
[notas/DECISIONES.md](DECISIONES.md). Vale la pena leerlo antes de proponer
un cambio que parezca una mejora obvia: varias cosas que se ven raras son
deliberadas.
