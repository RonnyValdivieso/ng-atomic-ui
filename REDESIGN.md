# Backoffice redesign — tracking

Working branch: **`redesign`**. Faithful re-skin of the BrandBot backoffice to the
new design, screen by screen.

## Design source
Reference files (not in this repo):
`/Volumes/Ronny 1TB/makersclub/repos/brandbot_backoffice_design/`
- `Login.html` — login + 2FA variants (we use **variant A**, centered card).
- `Workspaces.html` — the app shell CSS (`<style>`) + Workspaces list/detail.
- `backoffice.jsx` — React mock of the shell, nav, account page, lists, detail.
- `design-canvas.jsx` — design-canvas harness (ignore).

## Conventions / decisions (keep consistent)
- **Faithful to the design** using the design's own CSS tokens, scoped per component
  on `:host` (light) + `:host-context(.p-dark)` (dark). The app toggles dark via the
  `.p-dark` class on `<html>` (`ThemeService`), not `[data-theme]`.
- Font **Geist** / **Geist Mono** (loaded in `src/index.html`).
- **Don't build dead UI.** Omit features with no backend, or render as clearly-labelled
  placeholders only when asked (e.g. topbar search/notifications/help are placeholders).
- Reuse shared atoms/molecules; unify components rather than duplicating.
- Commits: Conventional Commits, **no `Co-Authored-By` trailer** (user's global pref).
- Dev server: `npm start` (staging). Type-check: `npx tsc -p tsconfig.app.json --noEmit`.
- API swagger: auth `https://auth-stg.brandbot.ch/swagger/v1/swagger.json`,
  main `https://api-stg.brandbot.ch/swagger/v1/swagger.json`.

## Done
- [x] **Login** — variant A centered card. `src/app/pages/login/`
- [x] **2FA (login)** — 6-box OTP, method chip, validity countdown. `pages/login/code/`
- [x] **My account** (`/admin/account`, lazy) — API-integrated. `pages/account/`
  - Profile: GET/PUT `/accounts/profile`; language `<select>` (`/api/languages`);
    timezone picker (`app-timezone-select`, `/api/time-zones`, search + infinite scroll).
  - Two-step verification: `/two-factor/{status,setup,enable,disable}`; QR via `qrcode`.
- [x] **App shell** — floating-panel grid: collapsible sidebar (brand + footer, state in
  `localStorage` `bb_nav_collapsed`), topbar (search/theme pill/bell/help/avatar), rich
  user-menu popover. `components/templates/main-layout/`, `organisms/sidebar/`,
  `organisms/header/`.
- [x] Shared: `atoms/qr-code`, `atoms/avatar` (brand gradient, unified header+profile),
  `molecules/otp-input`, `molecules/timezone-select`.
- [x] `AuthService.patchCurrentUser` / `ensureDisplayName` (header initials when login
  payload omits the name).
- [x] **Admin list pattern** — shared organism `organisms/data-table` (table-card +
  toolbar + sortable headers + custom pager + optional grid view; emits a single
  `(query)` event so the parent only fetches and feeds back `data`/`totalRecords`).
  Built-in cell types (`name`, `status`, `text`, `actions`, `template`) + projected
  templates via `*appDataCell="field"` and `appDataGridCard`. Per-design change: the
  row id moved out of the name cell into a compact `atoms/copy-id-button` inside the
  row/card actions. The `name` cell takes an optional `pictureField` column option —
  when the row has a truthy URL there it renders an `<img>` avatar (lazy, `object-fit:
  cover`), otherwise it falls back to monogram initials.
- [x] **Workspaces** — list (table + grid card view, search, sortable headers, status
  pill, filter chips as disabled placeholders, Export disabled). `pages/admin/workspaces/list/`.
- [x] **Organizations** — list (table-only). `pages/admin/organizations/list/`.
- [x] **Service Teams** — list (CRUD + toggle Active/Inactive). Name cell uses the
  `pictureField: 'squarePicture'` avatar (initials fallback); `Code` renders as a mono
  `code-pill`; secondary actions live in the `molecules/row-actions-menu` popover. The
  status comparison is case-insensitive so staging's `ACTIVE` doesn't flip the pause/play
  icon. The endpoint URL is `/v1/service-teams` (kebab-case). `pages/admin/service-teams/list/`.
- [x] **System Roles** — list with a derived `Scope` column (`Global` / `Instance`);
  the raw `instanceId` GUID is never shown. `pages/admin/roles/list/`.
- [x] **Modules & Permissions** — list (CRUD). `pages/admin/modules/list/`.
- [x] **Notification Templates** — list (Name / Asset / Type / Language).
  `pages/admin/notification-templates/list/`.
- [x] **Inference Provider Types** — list (grid-default, table + grid, `X of Y types`
  counter, Edit/Delete actions, native `confirm()` replaced by `app-confirm-dialog`).
  Drove two organism extensions: `initialView` input and a `[data-table-toolbar-right]`
  projection slot. `pages/inference-provider-types/list/`.
- [x] **Storage Types** — mirrors the IPT redesign. `pages/storage-types/list/`.
- [x] **Authentication Log** — labelled placeholder in the new style (no backend yet).
  `pages/admin/authentication-log/list/`. The Tailwind `_coming-soon` helper was dropped.
- [x] **Workspace** detail — back-link + page-head (status pill + labelled Copy-ID pill +
  disabled Editar/More), tab bar (Información live; Miembros/Configuración/Actividad as
  `PENDING · DESIGN_IN_PROGRESS` placeholders), two-column detail-grid: Información
  field-grid (adds real Organización link + Equipo de servicio) + aside (Metadatos with
  `—` placeholders, Acciones rápidas as disabled placeholders — no backend for
  edit/deactivate/archive/delete or created/updated/author). Extended `atoms/copy-id-button`
  with a labelled pill variant (`[compact]="false"`). `pages/admin/workspaces/details/`.
- [x] **Service Team** detail — rebuilt to `service-team-detail.jsx`, kept to **real API
  data only** (the design's Responsable / Descripción / Metadatos have no backend and were
  dropped; the once-shown Asignaciones counts were invented — `ServiceTeamResponse` per
  swagger is just `id, name, status, squarePicture, rectangularPicture, email, phone, code,
  address`). Page-head: **avatar** (`squarePicture` → `<img>`, else initials), title, status
  pill, and a `código · N miembros` subtitle. **Tabs: Información | Miembros** — the count
  and roster come from the real `GET /v1/service-teams/{id}/members` (paginated; its item
  shape isn't in swagger so `ServiceTeamMember` is defensive — `memberName()` falls back
  across `fullName`/`name`/`firstName+lastName`/`email`). Información card view shows Código /
  Miembros / Email / Teléfono / Dirección (status stays only in the header pill). **Edit is
  inline (edit-in-place)**: the card-head **Editar** swaps the field-grid for a form (Nombre |
  Código with info-tooltip + mono, icon-prefixed Email | Teléfono, Dirección), Guardar cambios
  (disabled until valid & dirty) / Cancelar, an **EDITANDO** header pill, Copy-ID hidden, the
  Miembros tab locked and Acciones-rápidas card dimmed while editing; save `PUT`s
  name/code/email/phone/address and flashes **GUARDADO**. Aside: **Acciones rápidas**
  (Activar/Desactivar via `PATCH /status`, Eliminar via `app-confirm-dialog`). No modal on the
  detail page (the list still uses `app-service-team-form`). Case-insensitive status check so
  staging's `ACTIVE` toggles correctly. `pages/admin/service-teams/details/`.
- [x] **Service Team** form — native modal (veil + card, Esc/backdrop close, no PrimeNG
  `p-dialog`) shared by list + detail, matching the `service-teams.jsx` design. Layout: a
  **Name | Code** row (both **required**), then an **Email | Phone** row and **Address**, then
  an `Images` divider with the square/rectangular picture pickers (create-only — the update is
  a JSON `PUT`, not multipart). **Code** is `input mono`, carries an `i-info` `field-tip`
  whose hover/focus tooltip reads "Lowercase letters, numbers and hyphens only. Must be
  unique." (flips `below`), auto-slugs as you type, and (on create) derives from Name until
  edited by hand. **Email / Phone / Address** use the `input-icon` wrapper with leading
  envelope / phone / map-marker icons. Create POSTs `multipart/form-data`; edit `PUT`s the
  updatable fields — Name / Code / Email / Phone / Address — prefilled from the row (`address`
  + `code` round-trip via the `ServiceTeam` / `UpdateServiceTeamRequest` interfaces). Inline
  validation: required Name, required Code, and email format show a red border + message on
  touch/submit. `pages/admin/service-teams/form/`.

## To do (design has these; not yet built)
- [ ] **Organization** detail. `pages/admin/organizations/details/`
- [ ] **Workspace selector** (`pages/workspace-selector/`, root `/` shell).
- [ ] Optional: 2FA section polish (SMS/passkey/trusted devices) — **needs backend**.
- [ ] Specs (`*.spec.ts`) for new services/components (most not added yet).

## Gotchas
- The **Playwright MCP browser holds the real logged-in session** — read-only is safe,
  but avoid mutating actions (profile save, enable/disable 2FA) without intent. To preview
  with mocked data, use `browser_run_code_unsafe` with `page.route(...)` + `addInitScript`
  to seed a fake token (`access_token`, `current_user`, `user_permissions`) — guards read
  those signals, no API call needed.
- Account route lives under `/admin/account` (admin shell), guarded by authGuard +
  superAdminGuard. Header user-menu links to `/admin/account/profile`.
- Pre-existing prod build warning: initial bundle over budget (not from this work; our new
  code is lazy-loaded). `qrcode` is allow-listed as CommonJS in `angular.json`.
