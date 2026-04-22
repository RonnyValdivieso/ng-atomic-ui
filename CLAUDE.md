# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BrandBot backoffice — an Angular 20 standalone, zoneless SPA for admins. The npm name is `ng-atomic-ui`. The UI is organized under Atomic Design (atoms → molecules → organisms → templates) with page-level components under `src/app/pages/` and route shells under `src/app/layouts/`. Styling uses Tailwind CSS v4 on top of a PrimeNG theme (`BlackNoirPreset` in `src/app/theme/`).

## Commands

Only the scripts below exist — `package.json` does not define `lint`, `format`, `e2e`, `test:watch`, or `test:coverage`, despite the README mentioning them.

- `npm start` — dev server on http://localhost:4200 using the **staging** environment (`environment.ts`, `api-stg.brandbot.ch`). This is the default per `.agent/instructions.md` — do not switch without a reason.
- `npm run start:local` — dev server using `environment.local.ts` (for pointing at a local backend).
- `npm run build` — production build (budgets: 500 kB warn / 1 MB error initial; 10 kB warn / 20 kB error per-component CSS).
- `npm run watch` — incremental development build.
- `npm test` — Karma + Jasmine unit tests (spec files `**/*.spec.ts`). To run a single file: `npx ng test --include='src/app/components/atoms/input/input.spec.ts'`. There is no `test:watch` — `ng test` already watches by default; add `--watch=false` for a single run. There is no lint or e2e runner configured.

## Architecture

### Route shells and auth

Routes live in `src/app/app.routes.ts`. Four layout shells host the app; each one is a standalone lazy-loaded component under `src/app/layouts/`:

- `main-layout` — authenticated default; redirects `/` → `/workspace-selector`.
- `admin-layout` — guarded by `authGuard` + `superAdminGuard`; hosts `/admin/*` pages (workspaces, organizations, service-teams, roles, modules, authentication-log, platform/*).
- `workspace-layout` — guarded by `authGuard`; hosts `/workspace/*` pages.
- `project-layout` — reserved for `/project` pages.

Auth is signal-based in `AuthService` (`src/app/shared/services/auth/auth.service.ts`):
- JWT + user + permission set persisted in `localStorage` (`access_token`, `current_user`, `user_permissions`).
- `authInterceptor` attaches `Authorization: Bearer <token>`; if the token is expired it calls `auth.logout()` and throws — add services to `provideHttpClient(withInterceptors([authInterceptor]))` automatically via `app.config.ts`.
- `isSuperAdmin` is currently a **heuristic** based on presence of `module:Instances` / `module:ServiceTeams`. Don't rely on it as a security boundary; prefer `hasPermission(...)` and treat role detection as pending an AAA API change.
- `authGuard` redirects unauthenticated users to `/login` preserving `redirectTo`.

### API layer

Services under `src/app/shared/services/api/` wrap HTTP calls with `HttpClient`. Always read URLs from `@env/environment` — never hardcode `apiUrl` or `authUrl`. The staging environment is the default; production uses `environment.prod.ts`, local uses `environment.local.ts`.

### Theme and change detection

`app.config.ts` wires:
- `provideZonelessChangeDetection()` — the app runs **without Zone.js**. All reactivity must go through signals, `toSignal`, or explicit `markForCheck`. Do not introduce `zone.js`-dependent patterns (e.g. `setTimeout`-driven view updates).
- `providePrimeNG(...)` with `BlackNoirPreset`, `prefix: 'p'`, and `.p-dark` as the dark-mode selector. `THEME_INITIALIZER` runs at startup.
- `provideAnimations()` is required for PrimeNG animations.

## Conventions

From `.agent/instructions.md` and `.github/copilot-instructions.md`:

- **Component files**: always split `.ts`, `.html`, `.css` (and `.spec.ts`). Inline templates only for trivially small components. Files use kebab-case **without** the `.component` suffix (e.g. `input.ts`, not `input.component.ts`) per the current Angular style guide. Selectors use `app-[name]`.
- **Standalone only**. Every component declares `standalone: true` and an explicit `imports` array.
- **Signals for state**: `input()`, `output()`, `model()`, `signal()`, `computed()`. See `src/app/components/atoms/input/input.ts` for the canonical ControlValueAccessor + signals pattern.
- **Forms**: prefer `ReactiveFormsModule` (`FormGroup`, `FormControl`). Reach for template-driven forms only for the very simplest inputs.
- **Environment-scoped URLs**: `import { environment } from '@env/environment'` and build from `environment.apiUrl` / `environment.authUrl`.
- **Development targets Staging** by default. If you need local, use `npm run start:local`.
- **No `Co-Authored-By` trailers in commits.**

## TypeScript path aliases

Defined in `tsconfig.app.json` (`baseUrl: "src"`). Use these — do not introduce deep relative imports.

```
@atoms/*            → app/components/atoms/*
@molecules/*        → app/components/molecules/*
@organisms/*        → app/components/organisms/*
@templates/*        → app/components/templates/*
@pages/*            → app/pages/*
@services/*         → app/shared/services/*
@interfaces/*       → app/shared/interfaces/*
@types/*            → app/shared/types/*
@utils/*            → app/shared/utils/*
@shared/*           → app/shared/*
@guide-components/* → app/pages/design-system-guide/components/*
@env/*              → environments/*
```

Note: the alias for design-system guides is `@guide-components/*`, not `@guides/*` as older docs in `.github/ALIAS-SYSTEM.md` claim. Trust `tsconfig.app.json`.

## TypeScript / Angular strictness

`tsconfig.json` enables `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, plus Angular's `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`, and `typeCheckHostBindings`. Expect template type errors to fail builds — fix types rather than casting away.

## API references

Swagger schemas (per `.agent/instructions.md`):

- Staging Auth: https://auth-stg.brandbot.ch/swagger/v1/swagger.json
- Staging API:  https://api-stg.brandbot.ch/swagger/v1/swagger.json
- Prod Auth:    https://auth.brandbot.ch/swagger/v1/swagger.json
- Prod API:     https://api.brandbot.ch/swagger/v1/swagger.json

## Further reading in `.github/`

Deeper (but partly aspirational) docs: `copilot-instructions.md`, `component-development-guide.md`, `routing-navigation-guide.md`, `LAYOUT-SYSTEM.md`, `ALIAS-SYSTEM.md`, `TAILWIND-INTEGRATION.md`, `angular-file-naming-update.md`. When they conflict with the code, the code wins (e.g. filename convention, alias names, npm scripts).
