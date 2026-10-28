# Skills

Este proyecto incluye un pequeño paquete de skills. `grill-me` siempre está instalada; el resto son opcionales.

## Créditos

`grill-me`, `zoom-out` y `tdd` están adaptadas de `mattpocock/skills` (MIT). `review` y `debugging`, y los catálogos de auditoría de `review/catalogs/`, están adaptados de `devAgent` (MIT).

## Instaladas

- `grill-me`: `auto`
- `zoom-out`: `manual`
- `tdd`: `manual`
- `review`: `auto`
- `debugging`: `manual`

## Política de modos

- `auto`: el agente puede usar la skill por iniciativa propia cuando la tarea encaja con la política del fichero de la skill.
- `manual`: el agente carga la skill solo cuando el usuario la pide o la tarea claramente la necesita.
- `none`: la skill no se instaló.

## Disparadores

- `/grillme` aclaración durante `spec` y `plan`.
- `/zoomout` revisión de coherencia antes de `implement`.
- `/tdd` pasada rojo-verde-refactor.
- `/sdd-review <EPICX/USn>` revisión independiente de una historia de usuario (o `/sdd-review spec <EPICX>` para la spec).
- `/sdd-debug` depuración por causa raíz de un test que falla o de un bug.
- `/sdd` retomar el flujo desde `docs/ROADMAP.md`.

Los comandos son envoltorios mínimos instalados para cada plataforma elegida al instalar (`.claude/commands/`, `.agent/workflows/`, `.opencode/commands/`). Solo apuntan aquí: estos ficheros `SKILL.md` son la única fuente de verdad.

Los comandos nuevos llevan el prefijo `sdd-` para no chocar con los comandos propios de la herramienta (Claude Code ya trae su propio `/review`).
