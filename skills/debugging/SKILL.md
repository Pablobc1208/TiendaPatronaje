---
name: debugging
description: Depuración buscando primero la causa raíz, para tests que fallan, bugs y comportamiento que no cumple la spec.
mode: manual
---

# Depuración

Úsala cuando un test falle de forma inesperada, se informe de un bug o el comportamiento no cumpla un criterio de aceptación.

## Flujo

1. **Reproduce** el problema de forma fiable y aísla el caso más pequeño. Si no lo puedes reproducir, di qué probaste y para: no corrijas a ciegas.
2. **Escribe un test que falle** y lo capture (test de regresión), cuando el comportamiento se pueda probar.
3. **Rastrea** hacia atrás desde el punto del fallo: entradas, estado y el punto de decisión donde se tomó el camino equivocado.
4. **Encuentra la causa raíz** preguntando "por qué" hasta que la respuesta sea un defecto y no un síntoma. Nombra el fichero y la función.
5. **Corrige la causa raíz** con el cambio mínimo. Ten en cuenta los efectos secundarios.
6. **Verifica**: el test de regresión pasa y toda la suite está en verde.

## No hagas

- Silenciar errores (bloques catch vacíos, try/except amplios) para que desaparezca un síntoma.
- Meter valores a fuego para que pase un test.
- Corregir en el mismo cambio más que la causa raíz; propón el resto como tareas nuevas.

## Salida

Un informe corto: síntoma, reproducción, causa raíz (fichero/función), corrección aplicada, resultado de la verificación.

## Modos

- `auto`: úsala siempre que un test falle por un motivo que no entiendas de inmediato.
- `manual`: con `/sdd-debug`.
