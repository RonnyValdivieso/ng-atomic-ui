# App Categories & Brandbot Apps — design

Date: 2026-06-05 · Branch: `redesign`

Two new super-admin catalog modules, built as a faithful re-skin of the
reference designs and wired to the real BrandBot main API. Both follow the
established redesign patterns (shared `app-data-table` organism, native-modal
forms, edit-in-place detail pages, `app-confirm-dialog`, `app-copy-id-button`,
`app-row-actions-menu`).

## Design source
Reference mockups (not in this repo):
`/Volumes/Ronny 1TB/makersclub/repos/brandbot_backoffice_design/`
- `app-categories.jsx` — App Categories list + detail + create/edit modal + delete.
- `apps.jsx` — Brandbot Apps list + detail (tabs) + create modal + delete.

## Decisions (confirmed with user)
- **Scope:** full per module — list + detail page + create/edit + delete + status
  toggle. Only fields/actions backed by the real API are built; invented design
  bits (apps-count, "Created by"/author) are dropped.
- **UI language:** English (matches the mockups and the Inference Provider Types list).
- **Sidebar:** a **new "Apps" section** (icon `pi-objects-column`) with the two pages.
- **Preferences editor:** `ngx-monaco-editor-v2` (Monaco) + image upload via the
  real picture endpoint.
- **`instanceId`:** the Brandbot App create POST requires it, so the create form
  includes an **Instance picker** and sends `instanceId`.

## Environment note
This repo is actually on **Angular 21** (`@angular/core ^21.2.9`), zoneless,
standalone — despite older docs saying Angular 20. Package versions below target
Angular 21; no `--legacy-peer-deps` needed.

---

## 1. Routing & navigation

New "Apps" section appended in `src/app/layouts/admin-layout/admin-layout.ts`
(`navigationItems`), section icon `pi-objects-column`:
- `{ label: 'App Categories', icon: 'pi-tags', route: '/admin/app-categories' }`
- `{ label: 'Brandbot Apps', icon: 'pi-objects-column', route: '/admin/brandbot-apps' }`

Routes added to the `admin` children block in `src/app/app.routes.ts`:
- `app-categories` → list; `app-categories/:code` → detail (keyed by **code**, matching the API `/{code}` path).
- `brandbot-apps` → list; `brandbot-apps/:id` → detail (keyed by **id**, uuid).

Pages live under `src/app/pages/admin/app-categories/{list,details,form}/` and
`src/app/pages/admin/brandbot-apps/{list,details,form}/` (kebab-case, no
`.component` suffix; `.ts`/`.html`/`.css` split).

## 2. Services & interfaces

Both services hit the **main API** (`environment.apiUrl`), use **PascalCase**
query params (`SortColumn`, `SortOrder`, `SearchString`, `PageNumber`,
`PageSize`), and return the established `PagedResult<T>` envelope (`items`,
`totalCount`, `pageNumber`, `pageSize`). `SearchParams` (camelCase internally) is
mapped to PascalCase in each `search()`, mirroring `ServiceTeamService.getMembers`.

### `AppCategoryService` — `@services/api/app-category.service.ts`, base `${apiUrl}/app-categories`
- `search(params: SearchParams): Observable<PagedResult<AppCategory>>`
- `getByCode(code: string): Observable<AppCategory>`
- `create(dto: CreateAppCategoryDto): Observable<AppCategory>` — POST
- `update(code: string, dto: UpdateAppCategoryDto): Observable<void>` — PUT (no `code` in body)
- `updateStatus(code: string, dto: { status: string }): Observable<void>` — PUT `/{code}/status`
- `delete(code: string): Observable<void>` — DELETE (may return 409 if referenced by an app; surfaced as an error toast)

### `BrandbotAppService` — `@services/api/brandbot-app.service.ts`, base `${apiUrl}/brandbot-apps`
- `search(params): Observable<PagedResult<BrandbotApp>>`
- `getById(id: string): Observable<BrandbotApp>`
- `create(dto: CreateBrandbotAppDto): Observable<BrandbotApp>` — POST (includes `instanceId`)
- `update(id: string, dto: UpdateBrandbotAppDto): Observable<void>` — PUT
- `updatePreferences(id: string, dto: { preferences: string }): Observable<void>` — PUT `/{id}/preferences`
- `updateStatus(id: string, dto: { status: string }): Observable<void>` — PUT `/{id}/status`
- `updatePicture(id: string, file: File): Observable<void>` — PUT `/{id}/picture` (multipart `FormData`)
- `delete(id: string): Observable<void>` — DELETE

### Interfaces (`@interfaces/...`)
Request DTOs are typed exactly from swagger:
- `CreateAppCategoryDto`: `{ code, name, description?, status? }`
- `UpdateAppCategoryDto`: `{ name?, description?, status? }`
- `CreateBrandbotAppDto`: `{ instanceId, name, description?, type?, version?, regionName?, regionCode?, allowedSubDomainCreation, baseDomain?, loadBalancerName?, domainZoneId?, preferenceModule?, jsonSettingsName?, settings?, picture?, defaultUrl?, downloadUrl?, downloadManualUrl?, category?, preferences?, developer? }`
- `UpdateBrandbotAppDto`: same minus `instanceId` (`allowedSubDomainCreation` nullable).

Response read-models (`AppCategory`, `BrandbotApp`) are written **defensively**
and **verified against staging first** (see §7). Expected: `AppCategory` ≈
`{ code, name, description?, status, ...timestamps? }`; `BrandbotApp` ≈ the create
DTO fields plus `id`, `status`, a picture URL field, and any timestamps. Optional
fields the live response omits are dropped from the UI (no dead UI).

### Status casing
The `Update…StatusDto` accepts `active` / `inactive` (lowercase, per the
app-categories swagger). Write that on toggle; the `app-data-table` status cell
already compares case-insensitively for display.

## 3. App Categories — pages

### List (`app-categories/list/`)
`app-data-table` columns: **Code** (`template`, mono), **Name** (`name`),
**Description** (`text`), **Status** (`status`), **Actions** (`template` — a view
button + `app-row-actions-menu` with Activate/Deactivate, Edit, Delete).
- Table + grid card view (`appDataGridCard`: tag-glyph card matching the mockup).
- Server search/sort/pagination via the `(query)` event.
- Toolbar-right counter: `{{ totalRecords() }} of {{ totalCount() }} categories`.
- **Status filter chip + Export render as disabled placeholders** (the API exposes
  no status/filter query params), per the established Workspaces precedent.
- Create/Edit open the shared form modal; Delete opens `app-confirm-dialog`;
  toggle calls `updateStatus`. Row click → detail.

### Detail (`app-categories/details/`, route `:code`)
- Back-link → `/admin/app-categories`.
- Page-head: tag avatar, name, status pill, `code` subtitle; labelled
  `app-copy-id-button` (hidden while editing).
- **Information card, edit-in-place** (mirrors Service Team detail): read-only
  `field-grid` ↔ reactive form. **Name + Description editable; Code read-only**
  (immutable — not in `UpdateAppCategoryDto`). `EDITING` head pill, `SAVED` flash
  on success. Save disabled until valid & dirty.
- **Quick actions aside:** Activate/Deactivate (`updateStatus`), Delete
  (`app-confirm-dialog` → `delete` → back to list). Dimmed while editing.
- Dropped: apps-count, Created/Created-by/author (no backend). Real timestamps
  shown only if the live response carries them.

### Form (`app-categories/form/`)
Native modal (veil + card, Esc/backdrop close — same shape as `service-team-form`),
reused by the list for **create** and **edit**:
- **Name** (required), **Code** (required, `input mono`, auto-slug to
  `UPPER_SNAKE` from Name until hand-edited, info-tip "Uppercase letters, numbers
  and underscores. Must be unique."; **create-only** — locked on edit),
  **Description** (optional textarea).
- Create → POST; Edit → PUT (`name`/`description` only).

## 4. Brandbot Apps — pages

### List (`brandbot-apps/list/`)
`app-data-table` columns: **Name** (`name`, `pictureField: 'picture'` → img else
initials), **Description** (`text`, clamped), **Type** (`template` → type pill),
**Category** (`template`, mono), **Version** (`template`, `v…`), **Default URL**
(`template` → external link), **Developer** (`text`), **Actions** (view +
`app-row-actions-menu`: Activate/Deactivate, Editor, Delete).
- Table + grid card view, server search/sort/pagination, counter
  `{{ totalRecords() }} of {{ totalCount() }} apps`.
- **Status / Type / Category filter chips + Export render as disabled
  placeholders** (no server-side filter params).
- New app → create modal; Delete → `app-confirm-dialog`; toggle → `updateStatus`.

### Create form (`brandbot-apps/form/`)
Wide native modal, sectioned like the mockup:
- **Basics:** Name (required), Version (required), Description, **Type** (select
  WEB/BACKEND/MOBILE/PLUGIN — free-string field), **Category** (select **populated
  from real active App Categories** via `AppCategoryService.search`), Developer.
- **Instance:** **Instance picker (required)** — sends `instanceId`. Sourced from
  the instances endpoint (`InstanceService`); verify the exact list call during
  implementation.
- **Region & domain:** regionName, regionCode, baseDomain, loadBalancerName,
  domainZoneId, `allowedSubDomainCreation` checkbox.
- **URLs:** defaultUrl, downloadUrl, downloadManualUrl.
- **Settings & preferences:** preferenceModule, jsonSettingsName, settings,
  preferences (the rich Monaco editor is on the detail page; create uses a plain
  mono textarea for preferences/settings).
- Create → POST `CreateBrandbotAppDto`.

### Detail (`brandbot-apps/details/`, route `:id`)
- Back-link → `/admin/brandbot-apps`.
- Page-head: picture/initials avatar, name, status pill + type pill,
  `v… · category · developer` subtitle, `app-copy-id-button` (id).
- **Tabs: Information / Preferences.**
  - **Information tab:**
    - **Image card** — `app-file-upload` (image), saved **independently** via
      `updatePicture` (its own Save/Cancel + `SAVED` flash).
    - **General / Region & domain / Settings cards** — read-only `field-grid`,
      with an **edit-in-place "Editor"** that swaps in a reactive form over the
      full `UpdateBrandbotAppDto` and PUTs on save.
  - **Preferences tab:** `<ngx-monaco-editor>` (`language: 'json'`,
    `automaticLayout: true`, dark theme off `.p-dark`), `[(ngModel)]` + `FormsModule`,
    saved **independently** via `updatePreferences`. Fallback: mono textarea + JSON
    validation if Monaco misbehaves under zoneless.
- **Aside:** Metadata (status, type, version, developer, real timestamps if
  present) + Quick actions (Activate/Deactivate, Editor, Open app if `defaultUrl`,
  Delete). Dimmed while editing.

## 5. Shared components reused
`app-data-table` (+ `DataTableColumn`, `*appDataCell`, `appDataGridCard`,
`[data-table-toolbar-right]`, `initialView`), `app-copy-id-button`,
`app-confirm-dialog`, `app-row-actions-menu`, `app-file-upload`. Per-page CSS
copies the established `.pill`/`.name-avatar`/`.btn`/`.card`/`.field-grid`/`.tabs`
primitives (the redesign pages do not use the generic `app-badge`/`app-chip`/`app-avatar` atoms).

## 6. New dependencies & config
- `npm i monaco-editor@^0.55 ngx-monaco-editor-v2@21.1.4`.
- `app.config.ts`: add `importProvidersFrom(MonacoEditorModule.forRoot())`.
- `angular.json`: add the assets glob `{ "glob": "**/*", "input":
  "node_modules/monaco-editor", "output": "/assets/monaco/" }` to the build (and,
  if needed, test) assets.

## 7. Implementation order & verification
1. **Probe staging (read-only GET)** for both resources to lock exact response
   field names, status casing, picture/timestamp presence — before finalizing the
   response interfaces.
2. Services + interfaces (+ **service specs** mirroring `role.service.spec.ts`).
3. App Categories: list → form → detail. Routes + nav.
4. Brandbot Apps: install Monaco; list → create form → detail (Info + Monaco
   Preferences + image). Routes + nav.
5. Verify: `npx tsc -p tsconfig.app.json --noEmit`; `npm run build` (watch the
   20 kB per-component CSS error budget on the apps detail); Playwright preview of
   each list + detail under `npm start` (staging).

Heavy component specs are skipped to match this branch's current practice; service
specs are added.

## 8. Risks
- **Undocumented response shapes** — mitigated by the step-1 live probe + defensive
  interfaces.
- **`instanceId` source** — depends on the instances list endpoint; confirm the
  exact call and whether the picker should scope/label by organization.
- **Monaco under zoneless Angular 21** — AMD-loader based; textarea fallback ready.
- **`DELETE /app-categories/{code}` 409** when referenced by an app — handled as a
  friendly error toast rather than a silent failure.
