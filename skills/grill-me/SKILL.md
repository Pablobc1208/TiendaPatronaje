---
name: grill-me
description: Pone a prueba una idea, épica, historia de usuario o plan con preguntas concretas antes de escribir specs o código.
mode: auto
---

# Grill Me

Úsala cuando el PM necesite ayuda para convertir una idea en una épica, historia de usuario, criterios de aceptación o plan claros.

## Objetivo

Eliminar la ambigüedad con el menor conjunto útil de preguntas y dejar un acuerdo escrito contra el que puedan comprobar las fases siguientes y los revisores.

## Política automática

- Úsala automáticamente al empezar `spec` y `plan`, y en cada tarea de arranque de EPIC0.
- Úsala automáticamente cuando aparezca una épica o historia nueva que aún necesite afinar su alcance.
- Úsala automáticamente cuando los criterios de aceptación, las restricciones o las dependencias no estén claros.
- Para cuando el PM pida explícitamente cerrar `spec` o `plan`. Un acuerdo genérico ("ok", "me parece bien") responde a la pregunta actual; no cierra la fase.
- No la uses para ediciones triviales, trabajo de implementación ya especificado o cuando el PM quiera ejecución ya.

## Disparador manual

- `/grillme` fuerza una pasada de aclaración aunque el agente no la hubiera elegido.

## Proceso

- Haz **una pregunta cada vez** y ofrece tu respuesta recomendada con un motivo de una línea. El PM puede aceptarla, corregirla o saltarla.
- Lee primero la documentación y el código existentes; nunca preguntes algo que el repositorio ya responde.
- Cubre: resultado, actores, restricciones, dependencias, no-objetivos, casos límite y cómo sabremos que funciona (criterios de aceptación).
- Saca a la luz compromisos y casos límite ocultos; propón alternativas cuando las haya.
- No escribas nada en las specs mientras preguntas. Para en cuanto el siguiente artefacto se pueda escribir sin adivinar.

## No hagas

- Empezar a implementar.
- Preguntas interminables o agrupadas.
- Recoger detalles que no cambian ninguna decisión.

## Salida

- Un resumen conciso del alcance aclarado, listo para escribirlo en la épica (`Problema`, `No-objetivos`, `Historias de usuario`, criterios de aceptación).
- La sección `Acuerdo` de la épica: decisiones tomadas, riesgos, preguntas abiertas.
- El mejor siguiente paso: spec, plan o división en tareas.
