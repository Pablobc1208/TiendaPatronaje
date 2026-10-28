# EPIC0 - Lay the foundation

This file is the canonical epic template for future `specs/EPICX/` folders. Keep the headings; replace the content.

## Problem

The project has no agreed specs, architecture, roadmap or agent rules yet, so agents would have to guess.

## Objective

Create the basic foundation of the project: agents constitution, initial specs, architecture and initial roadmap, so the project can start normal SDD sprints.

## Non-Goals

- Writing product code.
- Defining the user stories of future epics in detail (only their names and objectives).

## User Stories

### US0

As a product manager I want to define the basics of the project so that it can be developed following Agile SDD by AI agents and developers.

Acceptance criteria:

- **AC0.1** Given the scaffold, when EPIC0 is done, then `specs/SPECS.md` describes what, why, how, non-goals and operating principles with the PM's own answers, and no template instructions remain.
- **AC0.2** Given the scaffold, when EPIC0 is done, then `docs/ARCHITECTURE.md` names the stack, the project structure, the test command and the developer practices chosen by the PM.
- **AC0.3** Given the scaffold, when EPIC0 is done, then `docs/ROADMAP.md` lists at least the next epic with its objective, marked `new`.
- **AC0.4** Given the scaffold, when EPIC0 is done, then `AGENTS.md` declares the documentation language and any extra rules the PM asked for.

## Agreement

Outcome of the clarification (`grill-me`). Reviewers check the work against this section.

Entrevista con el PM (Pablo), 2026-10-28.

- Decisions:
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
  - Documentación en español; código en inglés.
- Risks:
  - Formato legal de la factura (datos fiscales de Clemen, numeración): validar con su gestoría antes de EPIC4.
  - PDF grandes pueden superar el límite de adjuntos del proveedor de correo: usar enlace firmado como alternativa.
- Open questions:
  - Proveedor de correo (propuesta: Resend), a cerrar en la spec de EPIC4.

## Related Files

- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `specs/SPECS.md`
- `specs/EPIC0/PLAN.md`
- `specs/EPIC0/TASKS.md`

## Retro

Filled when the epic is closed.

- Keep:
- Change:
- Action:
