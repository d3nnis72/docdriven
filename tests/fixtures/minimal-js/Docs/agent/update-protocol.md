# Update Protocol

- Behavior changes update affected knowledge docs.
- User-facing setup or command changes update human docs.
- Interface changes update `knowledge/interfaces/`.
- Architecture boundary changes update `knowledge/architecture/`.
- Structural changes update the architecture route before they become a new convention.
- Do not hardcode generic agent preferences such as default folders, favorite architecture patterns, or personal coding style.
- Follow documented project architecture, coding style, config flow, and route ownership.
- Prefer long-term project consistency over local convenience.
- Prefer existing reusable project primitives before creating one-off implementations.
- Keep feature-local code local until reuse is real.
- Add, split, rename, or consolidate folders and docs only when repository evidence shows stable responsibility, repeated patterns, dependency boundaries, or validation needs.
- When a durable convention is missing, infer from nearby code, choose the smallest consistent change, and record uncertainty in `agent/gaps.md`.
- Missing routes go in `agent/gaps.md` until fixed.
- Tmp notes are not truth until promoted.
