---
name: css
axis: language
composes_with: []
activates_on:
  extensions: [".css", ".scss", ".sass", ".less"]
  paths: []
  markers: []
artifact_shape: flat
tools: []
substitutes:
  - check: layer-integrity
    reason: "las hojas de estilo no tienen capa de orquestación, dominio ni persistencia"
  - check: query-in-loop
    reason: "las hojas de estilo no acceden a fuentes de datos"
---

# CSS

Se aplica a las hojas de estilo nuevas o modificadas, incluidos los dialectos de preprocesadores. Con Tailwind, las reglas de valores a fuego y tokens aplican también a las clases arbitrarias (`text-[#c0392b]`, `mt-[13px]`).

## Reglas

### Especificidad y cascada

- `!important` sin un comentario que lo justifique → **MAJOR**: impide sobrescribirlo después
- Anidamiento de selectores de más de 3 niveles → **MAJOR**: coincide con el umbral de anidamiento del núcleo
- Selectores de ID usados para dar estilo y no como ancla → **MINOR**
- Selector cualificado por etiqueta cuando basta la clase (`div.tarjeta`) → **MINOR**

### Duplicación

La regla DRY del núcleo aplica a las hojas de estilo igual que al código. Además:

- Un valor literal repetido en varias reglas cuando el proyecto define una variable o token para él → **MAJOR**, citando el token existente
- Un bloque de declaraciones duplicado en vez de reutilizar una clase o mixin existente → **MAJOR**

### Valores a fuego

- Color, espaciado, tamaño de letra o punto de corte escritos como literal cuando el proyecto tiene un token de diseño para ello → **MAJOR**
- Valor numérico mágico sin comentario que explique de dónde sale → **MINOR**

### Maquetación y robustez

- Altura fija en píxeles en un contenedor con texto → **MAJOR**: se rompe con el desbordamiento y con el zoom de letra del usuario
- Valor de `z-index` fuera de la escala declarada del proyecto, o un valor grande arbitrario → **MAJOR**
- Una regla que depende del orden en el fichero en vez de una especificidad explícita → **MINOR**

### Nombres

Los nombres de clase siguen la convención del proyecto (en español). Un nombre que describe la apariencia en vez del propósito (`.caja-roja`, `.mt-10-azul`) → **MINOR**; además aplican las reglas de nombres semánticos del núcleo.

### Reglas muertas

- Un selector que no encaja con nada en las plantillas o componentes tocados por el cambio → **MINOR**, indicando que confirmarlo en todo el proyecto queda fuera del alcance del cambio

## Notas de herramientas

Este catálogo no declara ninguna herramienta de análisis estático. Un proyecto que ejecute Stylelint puede declararlo en su propio `quality-profile.md`, que es aditivo.
