# Biblioteca de catálogos de auditoría

Las reglas específicas de cada tecnología que la skill `review` aplica al código nuevo o modificado. Adaptada de la biblioteca de catálogos de `devAgent` (MIT), donde cada catálogo es un fichero y añadir un stack nunca obliga a tocar la definición de un agente.

En este proyecto solo se conservan los catálogos de nuestro stack: `javascript`, `typescript` y `css`. Los del resto de lenguajes del scaffold original se han quitado.

## Por qué existen

Las comprobaciones del núcleo de `skills/review/SKILL.md` valen para cualquier código (complejidad, duplicación, nombres, inyección). Todo lo que depende de un lenguaje o framework (tipado, escapado, manejo de recursos) vive aquí. Lo que ningún catálogo cubre se informa como **N/A con motivo**, nunca como PASS: una comprobación que no se ejecutó nunca debe parecer una que pasó.

## Los tres ejes

Los catálogos son **ortogonales y se combinan**; no se anidan.

```
  LENGUAJE            FRAMEWORK          MOTOR DE PLANTILLAS
  qué es legal        dónde va           dónde se hace
  y peligroso         cada cosa          el escapado
  ─────────────       ─────────────      ───────────────
  javascript.md       (ninguno aún)      (ninguno aún)
  typescript.md  ──── se combina con javascript.md
  css.md
```

Un catálogo de lenguaje es una configuración completa por sí solo. No tener catálogo de framework es la configuración correcta para este proyecto, no un hueco: el revisor no debe avisar de ello ni rebajar el veredicto por ello.

## Formato de un catálogo

Un catálogo es un fichero markdown con frontmatter YAML. El frontmatter es lo que lee la detección (sus claves van en inglés porque son de máquina); el cuerpo es lo que aplica el auditor.

| Campo | Significado |
|---|---|
| `name` | Id del catálogo; coincide con el nombre del fichero. |
| `axis` | Eje al que pertenece: `language`, `framework` o `template`. |
| `composes_with` | Catálogos que se activan junto con este. Se declara aquí, nunca lo deduce el agente. |
| `activates_on` | Señales que lo activan: extensiones y rutas de ficheros **del diff**, más `markers` del repositorio. |
| `artifact_shape` | `layered`, `flat` o `any`. |
| `tools` | Análisis estático disponible para este stack. Opcional. |
| `substitutes` | Comprobaciones condicionales que este catálogo declara no aplicables, con su motivo. Opcional. |

Secciones del cuerpo: `## Reglas` (cada una con su severidad `CRITICAL`, `MAJOR` o `MINOR`), `## Vocabulario de capas` (solo frameworks) y `## Notas de herramientas`.

## Activación

Un catálogo de **lenguaje** se activa cuando un fichero del diff encaja con sus `extensions` o `paths`. Un catálogo de **framework** se activa cuando ya está activo un catálogo de lenguaje con el que se combina **y** el repositorio contiene uno de sus `markers`.

## Sustituir una comprobación condicional

Un catálogo puede declarar no aplicable una comprobación **condicional** del protocolo para su stack, siempre con motivo, que se imprime en el informe junto al N/A. La sustitución solo cubre los ficheros del catálogo que la declara.

- **El núcleo incondicional no se puede sustituir**: complejidad, DRY, nombres semánticos y vectores de inyección aplican siempre.
- **Solo los catálogos pueden sustituir.** Las reglas del proyecto en `docs/ARCHITECTURE.md` son aditivas: añaden o endurecen reglas, nunca apagan una.

## Las tres capas de precedencia

```
  1. Comprobaciones del núcleo  (skills/review/SKILL.md)   nunca se desactivan
  2. Catálogos                  (esta carpeta)             pueden sustituir condicionales
  3. Reglas del proyecto        (docs/ARCHITECTURE.md)     solo aditivas
```

Si una regla del proyecto contradice o relaja una del núcleo o de un catálogo, aplica la más estricta y el conflicto se anota en el informe.

## Añadir un catálogo

1. Crea `<nombre>.md` aquí con el frontmatter de arriba.
2. Declara su `axis`, con qué se combina (`composes_with`) y qué lo activa.
3. Escribe las reglas bajo `## Reglas`, cada una con su severidad.
4. Si el stack tiene análisis estático, decláralo en `tools` con una invocación limitada al diff.
5. Si una comprobación condicional no aplica a este stack, decláralo en `substitutes` con motivo.

Nada más cambia: ni la skill de revisión ni los agentes revisores.
