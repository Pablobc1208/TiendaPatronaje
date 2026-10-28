---
name: zoom-out
description: Da un paso atrás y reevalúa alcance, arquitectura o dirección antes de comprometerse con la implementación.
mode: manual
---

# Zoom Out

Úsala cuando el trabajo se sienta demasiado local, el diseño sea inestable o un cambio pueda propagarse por el proyecto.

## Flujo

- Resume el problema de alto nivel en dos o tres frases.
- Comprueba las tareas contra `docs/ARCHITECTURE.md`, `specs/CAPABILITIES.md` y el código existente: responsabilidades duplicadas, convenciones rotas, abstracciones compartidas que habría que reutilizar.
- Enumera unos pocos enfoques viables cuando haya una elección real.
- Señala la mantenibilidad a largo plazo y el coste de contexto.
- Recomienda la opción más pequeña si queda incertidumbre.

## Política automática

- Úsala automáticamente justo antes de `implement`, cuando las historias y tareas estén definidas y el trabajo pase de la definición a la entrega.
- Para cuando el PM quiera explícitamente pasar a `implement`.
- No la uses automáticamente si no se ve ningún riesgo de arquitectura, coherencia o transversal.

## Disparador manual

- `/zoomout` fuerza una revisión de coherencia antes de implementar.

## Mantenla ligera

- No sobreexplores. Prefiere apoyar la decisión antes que un análisis exhaustivo.
- Vuelve a la tarea concreta en cuanto la dirección esté clara.
