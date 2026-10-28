---
name: typescript
axis: language
composes_with: [javascript]
activates_on:
  extensions: [".ts", ".tsx"]
  paths: []
  markers:
    - file: "tsconfig.json"
artifact_shape: any
tools: []
substitutes: []
---

# TypeScript

Se aplica a los ficheros TypeScript nuevos o modificados. Se combina con `javascript`: TypeScript compila a JavaScript y las reglas de JavaScript valen para él, así que no se repiten aquí.

> **Nota de extracción.** Las reglas de abajo formaban parte de la comprobación *3.4 Tipado estricto — JavaScript / TypeScript* del protocolo de auditoría antes de que existiera la biblioteca de catálogos. Se reproducen sin cambios, con sus severidades originales.

## Reglas

### Tipado

- Uso de `any` sin un comentario que lo justifique → **MINOR**
- Falta de tipos explícitos en parámetros o retornos de funciones públicas → **MINOR**

## Notas de herramientas

Este catálogo no declara ninguna herramienta de análisis estático. Un proyecto que ejecute `tsc --noEmit` o ESLint con reglas de tipos puede declararlo en su propio `quality-profile.md`, que es aditivo.
