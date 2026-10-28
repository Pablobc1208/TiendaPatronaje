---
name: javascript
axis: language
composes_with: []
activates_on:
  extensions: [".js", ".mjs", ".cjs", ".jsx"]
  paths: []
  markers:
    - file: "package.json"
artifact_shape: any
tools: []
substitutes: []
---

# JavaScript

Se aplica a los ficheros JavaScript nuevos o modificados.

> **Nota de extracción.** La regla de abajo formaba parte de la comprobación *3.4 Tipado estricto — JavaScript / TypeScript* del protocolo de auditoría antes de que existiera la biblioteca de catálogos. Se reproduce sin cambios, con su severidad original.

## Reglas

### Tipado

- Funciones complejas sin anotaciones de tipo JSDoc → **MINOR**

## Notas de herramientas

Este catálogo no declara ninguna herramienta de análisis estático. Un proyecto que ejecute ESLint o un comprobador de tipos sobre JavaScript puede declararlo en su propio `quality-profile.md`, que es aditivo.
