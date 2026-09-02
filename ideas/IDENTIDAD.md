# Velorah — identidad y guion de las secciones

Guardado el 2 de septiembre de 2026. Las secciones se sacaron de la página
para rehacerlas con video propio en vez de recortes del hero.

## La tesis

**El silencio es donde se trabaja.**

Lo bueno se hace en soledad, sin público y sin validación. El slogan
"Where dreams rise through the silence" no es una frase decorativa: es una
afirmación sobre cómo se hace el trabajo creativo. Lo que ves terminado
nació en horas que nadie presenció.

Esto va a contramano de la cultura de mostrar el proceso en vivo. Ese
contraste es lo que le da filo.

## Por qué funciona con el video

Las manos que casi se tocan son la Creación de Adán de Miguel Ángel, pero
recortada **justo antes del contacto**. No es la unión: es la inminencia.
El instante anterior a que algo exista.

Con el loop en ping-pong, las manos se acercan y se separan sin resolverse
nunca. Eso dejó de ser un arreglo técnico y pasó a ser parte del sentido:
el ciclo se repite, nunca se cierra.

## El arco: noche → amanecer

Tres secciones, un solo movimiento:

| Sección | Qué cuenta |
|---|---|
| **1. Hero** | La promesa. Las manos que casi se tocan |
| **2. La noche** | El trabajo invisible. Las horas sin testigos |
| **3. El amanecer** | Lo que emerge. Y volver a empezar |

El cierre importa: la sección 3 **no debe decir "y triunfaste"**. Debe decir
"y otra vez". El amanecer no es la meta, es el intervalo antes de la
siguiente noche.

## Textos (borrador)

### Sección 2 — La noche

> **I — The night**
>
> # Nobody sees *three in the morning.*
>
> There is no audience for the part that matters. No applause for the draft
> you delete, the version that almost worked, the hour spent on something
> nobody will ever notice was hard.
>
> Just you, the screen, and the quiet suspicion that none of this is going
> anywhere.

### Sección 3 — El amanecer

> **II — The morning**
>
> # And then there is *the morning.*
>
> What survives the night does not need a story about how hard it was. It
> stands on its own, and the work explains itself.
>
> Then the light fades, and the silence returns, and there is more to make.
> That is not the price of the work. That is the work.

En ambos titulares, la segunda mitad va en `text-white/60` sin cursiva
(`<em className="not-italic">`), igual que el hero.

## Qué falta

Videos propios para cada sección, manteniendo la paleta:

- **Sección 2:** azul noche con nubes rosas (el panel 2 del hero es la
  referencia de color)
- **Sección 3:** el pasaje a dorado (panel 4 del hero)

Lo que se intentó y no funcionó: recortar los paneles del video del hero
como imágenes fijas. Cada panel tiene 310px de ancho, así que estirado a
media pantalla ya se nota blando, y a pantalla completa se pixela. Hacen
falta piezas generadas a su propia resolución.

## Componentes guardados

- `Section.tsx` — sección a pantalla completa con panel de imagen a un lado
  y texto al otro, alternando de lado. Aparición al entrar en viewport.
  Sirve tal cual cambiando `<img>` por `<video>`.
- `Story.tsx` — las dos secciones con los textos de arriba.

Para volver a montarlas: mover los dos archivos a `src/components/` y
agregar `<Story />` después del bloque del hero en `App.tsx`.
