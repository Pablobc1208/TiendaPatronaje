---
name: tdd
description: Construye o cambia código con un ciclo rojo-verde-refactor, una porción vertical cada vez.
mode: manual
---

# TDD

Úsala al implementar una funcionalidad o una corrección cuyo comportamiento se pueda expresar con tests.

## Flujo

1. Elige un criterio de aceptación o un comportamiento de la tarea.
2. Escribe el test más pequeño que falle contra la interfaz pública. **Ejecútalo y míralo fallar** por el motivo esperado; un test que nunca falló no demuestra nada.
3. Hazlo pasar con el mínimo código. Nada de funcionalidad extra más allá de lo que pide el test.
4. Refactoriza manteniendo la suite en verde.
5. Repite con el siguiente comportamiento: primero el camino feliz, después los casos límite y los errores.

## Alcance

- Comportamiento nuevo o cambiado: siempre test primero.
- Corrección de bugs: empieza con un test de regresión que reproduzca el bug y después corrige.
- Código previo que no estás cambiando: no le añadas tests ni lo refactorices "para hacerlo testeable". Puedes anotar la carencia como observación.

## Mantenla ligera

- Prueba el comportamiento, no las tripas. Prefiere tests de integración a mocks de tu propio código.
- Nunca marques una tarea `[<]` con tests que fallan o se saltan, ni con tests sin aserciones reales.
- Informa de lo probado: tests escritos, casos límite cubiertos, resultado de la suite.

## Modos

- `auto`: aplícala a toda tarea que añada o cambie comportamiento.
- `manual`: empieza una pasada TDD con `/tdd`.
