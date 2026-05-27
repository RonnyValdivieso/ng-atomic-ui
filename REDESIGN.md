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

## To do (design has these; not yet built)
- [ ] **Workspaces** — list (`.table-card`/`.tbl`, toolbar, view toggle, pager) + detail.
      Existing pages: `pages/admin/workspaces/{list,details}`.
- [ ] **Organizations** — list + detail. `pages/admin/organizations/`
- [ ] **Service Teams**, **System Roles**, **Modules & Permissions**,
      **Notification Templates**, **Authentication Log** (under `pages/admin/`).
- [ ] **Inference Provider Types**, **Storage Types** (under `pages/`).
- [ ] **Workspace selector** (`pages/workspace-selector/`, root `/` shell).
- [ ] Optional: 2FA section polish (SMS/passkey/trusted devices) — **needs backend**.
- [ ] Specs (`*.spec.ts`) for new services/components (not added yet).

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
