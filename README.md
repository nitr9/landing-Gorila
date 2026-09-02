# Proyecto nuevo

Base de trabajo vacía, lista para empezar. La landing anterior se descartó el
2 de septiembre de 2026 — ver [notas/DECISIONES.md](notas/DECISIONES.md).

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui

## Empezar

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
├── components/ui/button.tsx  Botón shadcn con variante "glass"
├── lib/utils.ts              Helper cn()
├── App.tsx
├── index.css                 Tema y variables de color
└── main.tsx

public/
└── favicon.svg

notas/
├── ESTADO.md      Dónde estamos hoy
├── DECISIONES.md  Por qué las cosas son como son
└── CONTEXTO.md    Cómo trabajamos
```

## Antes de construir

El proyecto **todavía no está definido**: falta decidir tema, tipo de sitio y
tono. Ver [notas/ESTADO.md](notas/ESTADO.md).

## Personalizar

- **Colores:** variables HSL en `:root` dentro de `src/index.css`
- **Tipografías:** se importan desde `index.html`
