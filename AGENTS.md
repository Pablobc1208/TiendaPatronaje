# Constitución de los agentes

Este proyecto sigue un flujo Agile SDD ligero, con la documentación primero. Este fichero es la constitución y es corto a propósito. El paso a paso de cada fase está en `docs/METHODOLOGY.md`: lee solo la sección de la fase en la que estés.

## Innegociables

- Lee primero `docs/ROADMAP.md` en cada chat nuevo o al arrancar un agente.
- La documentación es la fuente de verdad. Si algo cambia, primero cambia la documentación.
- Mantén el contexto pequeño. Si algo no hace falta para la tarea actual, no lo cargues.
- Nunca adivines contenido de negocio, alcance ni detalles del dominio. Si no están documentados, haz al PM una pregunta concreta.
- Sé honesto: cuando algo no se pueda conseguir, dilo y propón una alternativa en vez de forzarlo.
- Prefiere skills pequeñas y reutilizables y specs pequeñas y concretas.
- Usa herramientas MCP solo cuando aporten valor real.
- El flujo de Git lo gestionan los desarrolladores, no los agentes, salvo que el desarrollador pida lo contrario de forma explícita. Los agentes pueden sugerir un mensaje de commit cuando una tarea llega a `[<]`.
- **Arranque del proyecto (EPIC0):** los ficheros del scaffold, las plantillas, `README.md` y `package.json` son marcadores. No deduzcas de ellos las specs, la arquitectura ni el roadmap. Haz una entrevista con el PM (`grill-me`) antes de escribir `specs/SPECS.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` o `AGENTS.md`.
- Ante la duda, pregunta antes de actuar.

## Idioma

- Todo el proyecto va en español: documentación, specs, informes de revisión, mensajes de commit, textos de la tienda, código (identificadores) y comentarios del código.
- Excepciones: palabras reservadas del lenguaje, nombres de librerías y APIs externas, y convenciones de los frameworks (por ejemplo `loader`, `action`, `useState`).
- Los marcadores de estado, los IDs (`EPICX`, `USn`, `ACn.m`, `Tn`) y los nombres de fichero de la metodología no cambian con el idioma.

## Reglas del proyecto

- Nunca hacer públicos los PDF de los patrones: se sirven solo a quien los ha pagado (correo o cuenta), con enlaces firmados que caducan.
- El panel `/admin` no se enlaza desde la tienda, exige rol `admin` comprobado en el servidor y lleva `noindex`.
- Nunca guardar secretos (claves de Stripe, Supabase service role, proveedor de correo) en el repo.
- Precios siempre con IVA incluido y en euros.
- Si una tarea necesita fotos, logo o textos de Clemen y no están en el repo, pedirlos al PM en vez de inventarlos.

## Regla de navegación

Carga solo el contexto mínimo necesario:

1. `docs/ROADMAP.md`: localiza la épica actual y su estado (`spec`, `plan`, `tasks`, `implement`, `review`).
2. `docs/METHODOLOGY.md`: lee solo la sección de esa fase.
3. Los ficheros de `specs/EPICX/` que necesite el paso actual. No abras épicas, planes ni tareas que no tengan relación.
4. `docs/GLOSSARY.md` solo cuando un término no esté claro. `docs/ARCHITECTURE.md` antes de implementar o revisar.
5. `specs/CAPABILITIES.md` cuando necesites saber qué hace ya el sistema hoy.
6. Skills: lee primero `skills/README.md` y después un único `SKILL.md`, solo cuando la tarea lo pida.

Después informa al PM del estado actual y propón el siguiente paso.

## Leyenda de estados

Épicas (en `docs/ROADMAP.md`): `new` → `spec` → `plan` → `tasks` → `implement` → `review` → `done`.

Ficheros de plan y de tareas: `WIP` o `closed`.

Tareas (en `specs/EPICX/TASKS.md`):

- `[ ]` pendiente
- `[-]` en curso
- `[!]` bloqueada
- `[<]` lista para revisión
- `[>]` en revisión
- `[x]` hecha (implementada, verificada, revisada y aprobada por el PM)

`[Tn]` detrás del estado es el id de la tarea (`[ ] [T3]`). `[Blocked by Tn, Tm]` indica las tareas que la bloquean. `(AC n.m)` al final de una tarea indica los criterios de aceptación que cubre.

## Definition of Ready (una US puede pasar a `tasks`)

- Está escrita como `Como X, quiero Y, para Z`.
- Tiene al menos un criterio de aceptación comprobable (`ACn.m`, Dado/Cuando/Entonces).
- Ninguna pregunta abierta la bloquea y sus dependencias están nombradas.
- Es lo bastante pequeña para dividirse en tareas que quepan cada una en una sesión de trabajo.

## Definition of Done (una tarea puede marcarse `[<]`)

- Es el cambio útil más pequeño que cumple la tarea, dentro del alcance de su US.
- Hay tests añadidos o actualizados para el comportamiento cambiado (casos límite incluidos) y toda la suite pasa.
- Las funciones principales están comentadas donde mejora la legibilidad.
- La documentación está actualizada si el cambio afecta a un contrato documentado.
- Una US está hecha (`[x]`) solo cuando sus criterios de aceptación están verificados y el PM la aprueba.

## Alcance de escritura

- Se puede escribir: el código, `docs/` y la carpeta de la épica **actual**.
- Historia de solo lectura: las carpetas de las épicas marcadas `done`. Un cambio en un comportamiento pasado se convierte en una US o épica nueva; nunca se reescribe una épica cerrada. En Claude Code lo impone el hook `sdd-guard` (`.claude/settings.json`).
- `specs/CAPABILITIES.md` solo se actualiza al cerrar una épica (ver `Close` en la metodología).
- Los revisores (la skill `review` / el agente `sdd-reviewer`) nunca editan código ni specs. Solo escriben `specs/EPICX/REVIEW.md`.

## Clasificación de cambios

Cuando el PM pide un cambio durante `implement` o `review`, clasifícalo antes de actuar y di de qué tipo es:

- **Cambio de alcance** (qué hace el sistema): actualiza primero la épica y sus criterios de aceptación, después las tareas. Si no encaja en la épica actual, propónlo para el backlog de `docs/ROADMAP.md`.
- **Cambio de implementación** (cómo se construye): añade o actualiza una tarea de la US actual.
- **Bug**: reprodúcelo, añade un test que falle y corrige la causa raíz (skill `debugging` si está instalada).

## Flujo de trabajo

Un sprint = una épica: `Spec -> Plan -> Tasks -> Implement -> Review (+ Close)`. Una historia de usuario cada vez salvo que el PM diga otra cosa. Actúa como product manager sénior en `spec`, `plan`, `tasks` y `review`, y como desarrollador sénior en `implement`. Detalles: `docs/METHODOLOGY.md`.

## Skills y disparadores

- Las skills `auto` se pueden usar por iniciativa propia cuando la tarea encaja con su política; las `manual`, solo cuando se piden.
- `/grillme` aclaración · `/zoomout` revisión de coherencia · `/tdd` rojo-verde-refactor · `/sdd-review` revisión independiente · `/sdd-debug` depuración por causa raíz · `/sdd` retomar el flujo.
- Si el usuario pide cerrar `spec` o `plan`, deja de usar `grill-me` para ese artefacto. Si pide pasar a `implement`, deja de usar `zoom-out`.

## Roles

- PM (humano, Pablo): define y confirma el alcance, aprueba cada cambio de fase y cada US.
- Agente productor (la sesión principal): escribe specs, planes, tareas, código y documentación.
- Agente revisor (`sdd-reviewer`, opcional): juicio independiente y de solo lectura con contexto limpio. Nunca produce.
- El desarrollador tiene la aprobación final y el control de Git, sobre todo en cambios que afectan al alcance o al comportamiento.
