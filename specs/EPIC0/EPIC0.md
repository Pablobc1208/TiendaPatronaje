# EPIC0 - Fundación

Este fichero es también la plantilla de épica para las futuras carpetas `specs/EPICX/`. Mantén los títulos y sustituye el contenido.

## Problema

El proyecto aún no tiene specs, arquitectura, roadmap ni reglas para los agentes acordadas, así que los agentes tendrían que adivinar.

## Objetivo

Crear la base del proyecto: constitución de los agentes, specs iniciales, arquitectura y roadmap inicial, para que el proyecto pueda empezar los sprints SDD normales.

## No-objetivos

- Escribir código del producto.
- Definir en detalle las historias de usuario de las épicas futuras (solo sus nombres y objetivos).

## Historias de usuario

### US0

Como product manager, quiero definir las bases del proyecto, para que agentes de IA y desarrolladores puedan desarrollarlo siguiendo Agile SDD.

Criterios de aceptación:

- **AC0.1** Dado el scaffold, cuando EPIC0 esté terminada, entonces `specs/SPECS.md` describe qué, por qué, cómo, no-objetivos y principios de funcionamiento con las respuestas del propio PM, y no queda ninguna instrucción de plantilla.
- **AC0.2** Dado el scaffold, cuando EPIC0 esté terminada, entonces `docs/ARCHITECTURE.md` nombra el stack, la estructura del proyecto, el comando de tests y las prácticas de desarrollo elegidas por el PM.
- **AC0.3** Dado el scaffold, cuando EPIC0 esté terminada, entonces `docs/ROADMAP.md` enumera al menos la siguiente épica con su objetivo, marcada `new`.
- **AC0.4** Dado el scaffold, cuando EPIC0 esté terminada, entonces `AGENTS.md` declara el idioma del proyecto y las reglas extra que haya pedido el PM.

## Acuerdo

Resultado de la aclaración (`grill-me`). Los revisores comprueban el trabajo contra esta sección.

Entrevista con el PM (Pablo), 2026-10-28.

- Decisiones:
  - Pasarela de pago: Stripe. Sin transferencia bancaria.
  - Sin productos físicos ni envíos: los patrones se entregan en PDF al correo que indica el cliente al comprar.
  - De la tienda antigua solo se migran los productos.
  - TypeScript (TSX).
  - Panel de administración en `/admin`, no visible para el cliente, con usuario y contraseña seguros.
  - Cada pedido genera factura.
  - Enlace de descarga válido 7 días y re-descarga ilimitada desde la cuenta del cliente.
  - Dominio: se decide más adelante (EPIC8); mientras, URL de pruebas de Cloudflare.
  - Fotos, logo y textos: los aporta el PM cuando hagan falta.
  - Diseño: una sola guía visual, sin rondas de referencias.
  - Todo el proyecto en español: documentación, código, comentarios y commits.
- Riesgos:
  - Formato legal de la factura (datos fiscales de Clemen, numeración): validar con su gestoría antes de EPIC4.
  - PDF grandes pueden superar el límite de adjuntos del proveedor de correo: usar enlace firmado como alternativa.
- Preguntas abiertas:
  - Proveedor de correo (propuesta: Resend), a cerrar en la spec de EPIC4.

## Ficheros relacionados

- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `specs/SPECS.md`
- `specs/EPIC0/PLAN.md`
- `specs/EPIC0/TASKS.md`

## Retro

Se rellena al cerrar la épica.

- Mantener:
- Cambiar:
- Acción:
