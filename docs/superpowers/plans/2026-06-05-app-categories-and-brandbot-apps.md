# App Categories & Brandbot Apps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two super-admin catalog modules — App Categories and Brandbot Apps — as a faithful re-skin of the reference mockups, wired to the real BrandBot main API.

**Architecture:** Standalone, signal-based, zoneless Angular 21 pages following the established redesign patterns: shared `app-data-table` organism for lists (server search/sort/pagination via its `(query)` event), native-modal forms, edit-in-place detail pages, `app-confirm-dialog` / `app-copy-id-button` / `app-row-actions-menu`. Two typed `HttpClient` services on `environment.apiUrl`. The Brandbot App preferences editor uses Monaco (`ngx-monaco-editor-v2`).

**Tech Stack:** Angular 21 (standalone, zoneless, signals), PrimeNG `BlackNoirPreset` + Tailwind v4, RxJS, Karma + Jasmine, `monaco-editor` + `ngx-monaco-editor-v2`.

**Spec:** `docs/superpowers/specs/2026-06-05-app-categories-and-brandbot-apps-design.md`

**Reference mockups (not in repo):** `/Volumes/Ronny 1TB/makersclub/repos/brandbot_backoffice_design/app-categories.jsx`, `.../apps.jsx`

---

## Conventions for every task

- Files split `.ts` / `.html` / `.css`; kebab-case, no `.component` suffix; selectors `app-…`; `standalone: true` with explicit `imports`.
- State via signals (`signal`, `computed`, `input`, `output`); forms via `ReactiveFormsModule`.
- URLs from `@env/environment` only. Path aliases (`@organisms/*`, `@molecules/*`, `@atoms/*`, `@services/*`, `@interfaces/*`, `@env/*`) — no deep relative imports.
- UI copy in **English**.
- Type-check gate (run after each page): `npx tsc -p tsconfig.app.json --noEmit` → expect no errors.
- Commits: Conventional Commits, **no `Co-Authored-By` trailer**.

### Re-skin authoring rule (templates & CSS)
For `.html`/`.css` steps, replicate the structure and CSS of the **named sibling page** (already in the repo, already on the new design) and adapt it to the columns/fields stated in the task. Pull exact visual structure from the named mockup line range. This is not a placeholder: the sibling page + mockup are the literal source. Sibling references:
- List pages → mirror `src/app/pages/inference-provider-types/list/list.html` + `list.css`.
- Detail pages (edit-in-place) → mirror `src/app/pages/admin/service-teams/details/details.html` + `details.css`.
- Form modals → mirror `src/app/pages/admin/service-teams/form/form.html` + `form.css`.

### Shared component contracts (verified, for reference while wiring)
- `app-data-table` inputs: `columns: DataTableColumn[]`, `data: unknown[]`, `loading`, `totalRecords`, `initialPageSize`, `searchable`, `searchPlaceholder`, `initialView: 'table'|'grid'`, `rowClickable`, `dataKey`, `emptyMessage`. Outputs: `(query)` → `SearchParams`, `(rowClick)` → row. Projection: `*appDataCell="<field>"` (context `$implicit`=row), `appDataGridCard`, `[data-table-toolbar]`, `[data-table-toolbar-right]`.
- `DataTableColumn`: `{ field, header, sortable?, align?: 'left'|'right'|'center', width?, type?: 'name'|'status'|'text'|'actions'|'template', value?: (row)=>string|null|undefined, pictureField? }`.
- `SearchParams`: `{ pageNumber, pageSize, searchString?, sortColumn?, sortOrder?: 'asc'|'desc' }`.
- `PagedResult<T>`: `{ items: T[]; totalCount; pageNumber; pageSize; totalPages?; hasNextPage?; hasPreviousPage? }` (from `@interfaces/aaa`).
- `app-copy-id-button`: `[value]`, `[label]`, `[compact]` (false = labelled pill).
- `app-confirm-dialog`: `[(visible)]`, `title`, `message`, `confirmLabel`, `cancelLabel`, `confirmVariant`, `[loading]`; `(confirmed)`, `(cancelled)`.
- `app-row-actions-menu`: `[items]: RowActionsMenuItem[]` (`{ label?, icon?, danger?, disabled?, divider?, action?: () => void }`), `ariaLabel`.
- `app-file-upload`: `label`, `accept`, `multiple`, `disabled`, `maxSizeMb`, `variant: 'default'|'circle'`; `(fileSelected)` → `File[]`.

---

## Task 0: Probe staging to lock response shapes

**Goal:** Replace assumptions with the real field names before writing interfaces. Read-only; mutates nothing.

**Files:** none (investigation only).

- [ ] **Step 1: Start the dev server**

Run: `npm start` (staging). Wait for `http://localhost:4200` to be ready. Log in if needed (the browser session carries the token).

- [ ] **Step 2: Capture both list responses from the browser console**

In the app (logged-in) browser devtools console, run:

```js
const t = localStorage.getItem('access_token');
const base = 'https://api-stg.brandbot.ch/api';
for (const p of ['/app-categories?PageNumber=1&PageSize=2', '/brandbot-apps?PageNumber=1&PageSize=2']) {
  const r = await fetch(base + p, { headers: { Authorization: 'Bearer ' + t } });
  console.log(p, r.status, JSON.stringify(await r.json(), null, 2));
}
```

- [ ] **Step 3: Record findings**

Note for each resource: the envelope (expect `PagedResult` — `items`/`totalCount`/`pageNumber`/`pageSize`), and on an item: does it carry `id`? `code`? exact `status` casing (`ACTIVE` vs `active`)? a picture URL field name (e.g. `picture`/`pictureUrl`/`logoUrl`)? any `createdAt`/`updatedAt`/`createdBy`? for categories any apps count?

Write the observed item shapes into the top of the spec file under a new "## Verified response shapes" heading (so later tasks reference reality). Commit:

```bash
git add docs/superpowers/specs/2026-06-05-app-categories-and-brandbot-apps-design.md
git commit -m "docs: record verified app-categories/brandbot-apps response shapes"
```

> **If a field below (e.g. `picture`, `id`, timestamps) is absent in the real response, drop it from the interface and any UI that reads it — no dead UI.** The code in later tasks assumes the most likely names (`id`, `code`, `status`, `picture`, `createdAt`, `updatedAt`); adjust to what Step 3 recorded.

---

## Task 1: App Category interfaces

**Files:**
- Create: `src/app/shared/interfaces/app-category.interface.ts`
- Modify: `src/app/shared/interfaces/index.ts` (add export)

- [ ] **Step 1: Write the interface file**

```ts
// src/app/shared/interfaces/app-category.interface.ts

/** Read-model for an app category. `description`/timestamps are optional —
 *  drop any field Task 0 showed the API does not return. */
export interface AppCategory {
  code: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

/** POST /app-categories body. */
export interface CreateAppCategoryDto {
  code: string;
  name: string;
  description?: string | null;
  status?: string;
}

/** PUT /app-categories/{code} body — note: no `code` (immutable). */
export interface UpdateAppCategoryDto {
  name?: string;
  description?: string | null;
  status?: string;
}

export interface UpdateAppCategoryStatusDto {
  status: string;
}
```

- [ ] **Step 2: Re-export from the interfaces barrel**

Open `src/app/shared/interfaces/index.ts` and add:

```ts
export * from './app-category.interface';
```

- [ ] **Step 3: Type-check & commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → expect no errors.

```bash
git add src/app/shared/interfaces/app-category.interface.ts src/app/shared/interfaces/index.ts
git commit -m "feat(interfaces): add app-category types"
```

---

## Task 2: AppCategoryService (TDD)

**Files:**
- Create: `src/app/shared/services/api/app-category.service.ts`
- Test: `src/app/shared/services/api/app-category.service.spec.ts`

- [ ] **Step 1: Write the failing spec**

```ts
// src/app/shared/services/api/app-category.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { environment } from '@env/environment';
import { AppCategoryService } from './app-category.service';
import { PagedResult } from '@interfaces/aaa';
import { AppCategory } from '@interfaces/app-category.interface';

describe('AppCategoryService', () => {
  let service: AppCategoryService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/app-categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppCategoryService,
      ],
    });
    service = TestBed.inject(AppCategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('search() maps SearchParams to PascalCase query params', () => {
    const result: PagedResult<AppCategory> = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 };
    service.search({ pageNumber: 2, pageSize: 10, searchString: 'crm', sortColumn: 'name', sortOrder: 'asc' })
      .subscribe(r => expect(r).toEqual(result));
    const req = http.expectOne(r => r.url === base);
    expect(req.request.params.get('PageNumber')).toBe('2');
    expect(req.request.params.get('PageSize')).toBe('10');
    expect(req.request.params.get('SearchString')).toBe('crm');
    expect(req.request.params.get('SortColumn')).toBe('name');
    expect(req.request.params.get('SortOrder')).toBe('asc');
    req.flush(result);
  });

  it('getByCode() GETs /{code}', () => {
    service.getByCode('CRM').subscribe();
    http.expectOne(`${base}/CRM`).flush({ code: 'CRM', name: 'CRM', status: 'ACTIVE' });
  });

  it('create() POSTs the dto', () => {
    service.create({ code: 'CRM', name: 'CRM' }).subscribe();
    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush({ code: 'CRM', name: 'CRM', status: 'ACTIVE' });
  });

  it('update() PUTs /{code}', () => {
    service.update('CRM', { name: 'Sales' }).subscribe();
    const req = http.expectOne(`${base}/CRM`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('updateStatus() PUTs /{code}/status', () => {
    service.updateStatus('CRM', { status: 'inactive' }).subscribe();
    const req = http.expectOne(`${base}/CRM/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'inactive' });
    req.flush(null);
  });

  it('delete() DELETEs /{code}', () => {
    service.delete('CRM').subscribe();
    const req = http.expectOne(`${base}/CRM`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
```

- [ ] **Step 2: Run the spec, verify it fails**

Run: `npx ng test --include='src/app/shared/services/api/app-category.service.spec.ts' --watch=false`
Expected: FAIL — cannot find module `./app-category.service`.

- [ ] **Step 3: Implement the service**

```ts
// src/app/shared/services/api/app-category.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PagedResult, SearchParams } from '@interfaces/aaa';
import {
  AppCategory,
  CreateAppCategoryDto,
  UpdateAppCategoryDto,
  UpdateAppCategoryStatusDto,
} from '@interfaces/app-category.interface';

@Injectable({ providedIn: 'root' })
export class AppCategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/app-categories`;

  search(params: SearchParams): Observable<PagedResult<AppCategory>> {
    let p = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.searchString) p = p.set('SearchString', params.searchString);
    if (params.sortColumn) p = p.set('SortColumn', params.sortColumn);
    if (params.sortOrder) p = p.set('SortOrder', params.sortOrder);
    return this.http.get<PagedResult<AppCategory>>(this.baseUrl, { params: p });
  }

  getByCode(code: string): Observable<AppCategory> {
    return this.http.get<AppCategory>(`${this.baseUrl}/${code}`);
  }

  create(dto: CreateAppCategoryDto): Observable<AppCategory> {
    return this.http.post<AppCategory>(this.baseUrl, dto);
  }

  update(code: string, dto: UpdateAppCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${code}`, dto);
  }

  updateStatus(code: string, dto: UpdateAppCategoryStatusDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${code}/status`, dto);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${code}`);
  }
}
```

- [ ] **Step 4: Run the spec, verify it passes**

Run: `npx ng test --include='src/app/shared/services/api/app-category.service.spec.ts' --watch=false`
Expected: PASS (6 specs).

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/services/api/app-category.service.ts src/app/shared/services/api/app-category.service.spec.ts
git commit -m "feat(api): add AppCategoryService with specs"
```

---

## Task 3: Add "Apps" nav section + App Categories routes

**Files:**
- Modify: `src/app/layouts/admin-layout/admin-layout.ts` (`navigationItems`)
- Modify: `src/app/app.routes.ts` (admin children)

- [ ] **Step 1: Add the nav section**

In `admin-layout.ts`, append a new section object to `navigationItems` (after the Platform section). Use the existing `NavigationItem` shape (`{ label, icon, route?, children? }`):

```ts
{
  label: 'Apps',
  icon: 'pi-objects-column',
  children: [
    { label: 'App Categories', icon: 'pi-tags', route: '/admin/app-categories' },
    { label: 'Brandbot Apps', icon: 'pi-objects-column', route: '/admin/brandbot-apps' },
  ],
},
```

- [ ] **Step 2: Add the App Categories routes**

In `app.routes.ts`, inside the `admin` route's `children` array (after `authentication-log`, before `account`), add:

```ts
{ path: 'app-categories', loadComponent: () => import('./pages/admin/app-categories/list/list').then(m => m.AppCategoriesListComponent) },
{ path: 'app-categories/:code', loadComponent: () => import('./pages/admin/app-categories/details/details').then(m => m.AppCategoryDetailsComponent) },
```

(The Brandbot Apps routes are added in Task 7. These imports resolve once Tasks 4 & 6 create the components — build after Task 6.)

- [ ] **Step 3: Commit**

```bash
git add src/app/layouts/admin-layout/admin-layout.ts src/app/app.routes.ts
git commit -m "feat(nav): add Apps section and app-categories routes"
```

---

## Task 4: App Categories — form modal

**Files:**
- Create: `src/app/pages/admin/app-categories/form/form.ts`
- Create: `src/app/pages/admin/app-categories/form/form.html`
- Create: `src/app/pages/admin/app-categories/form/form.css`

Mirror `src/app/pages/admin/service-teams/form/` (native modal: veil + card, Esc/backdrop close, no PrimeNG dialog).

- [ ] **Step 1: Write the component TypeScript**

```ts
// src/app/pages/admin/app-categories/form/form.ts
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppCategory, CreateAppCategoryDto, UpdateAppCategoryDto } from '@interfaces/app-category.interface';

@Component({
  selector: 'app-app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCategoryFormComponent {
  private fb = inject(FormBuilder);

  readonly visible = model(false);
  readonly isEditing = input(false);
  readonly current = input<AppCategory | null>(null);
  readonly saving = input(false);

  readonly save = output<CreateAppCategoryDto | UpdateAppCategoryDto>();

  private codeTouched = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/^[A-Z0-9_]+$/)]],
    description: [''],
  });

  readonly title = computed(() => (this.isEditing() ? 'Edit app category' : 'New app category'));

  constructor() {
    // Reset the form whenever the modal opens.
    effect(() => {
      if (!this.visible()) return;
      const c = this.current();
      this.codeTouched = this.isEditing();
      this.form.reset({ name: c?.name ?? '', code: c?.code ?? '', description: c?.description ?? '' });
      if (this.isEditing()) this.form.controls.code.disable();
      else this.form.controls.code.enable();
    });
  }

  private slug(s: string): string {
    return (s || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }

  onNameInput(value: string): void {
    if (!this.isEditing() && !this.codeTouched) {
      this.form.controls.code.setValue(this.slug(value));
    }
  }

  onCodeInput(value: string): void {
    this.codeTouched = true;
    this.form.controls.code.setValue(this.slug(value), { emitEvent: false });
  }

  close(): void { this.visible.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const description = v.description.trim() || null;
    if (this.isEditing()) {
      this.save.emit({ name: v.name.trim(), description } satisfies UpdateAppCategoryDto);
    } else {
      this.save.emit({ code: v.code.trim(), name: v.name.trim(), description, status: 'active' } satisfies CreateAppCategoryDto);
    }
  }
}
```

- [ ] **Step 2: Write the template**

Create `form.html` by mirroring `service-teams/form/form.html`. Structure:
- `@if (visible()) { <div class="modal-veil" (click)="close()"> <div class="modal modal-wide" (click)="$event.stopPropagation()" role="dialog" aria-modal="true"> … </div></div> }`
- `.modal-head`: `<h2>{{ title() }}</h2>` + close `×` button (`(click)="close()"`).
- `.modal-body` with `[formGroup]="form"`:
  - `.form-row` → **Name** field (`input.input`, `(input)="onNameInput($any($event.target).value)"`, required) and **Code** field (`input.input.mono`, `(input)="onCodeInput($any($event.target).value)"`, `formControlName="code"`, info-tip "Uppercase letters, numbers and underscores. Must be unique."). Code is disabled in edit mode (handled in TS).
  - **Description** field (`textarea.textarea`, optional `OPTIONAL` tag).
  - Show red-border + message on `control.invalid && control.touched` (copy the `.input.invalid` / error-text pattern from the sibling form).
- `.modal-foot`: Cancel (`btn`, `(click)="close()"`) and submit (`btn btn-primary`, `[disabled]="form.invalid || saving()"`, `(click)="submit()"`, label `{{ isEditing() ? 'Save changes' : 'Create category' }}`).

- [ ] **Step 3: Write the CSS**

Copy the modal/field/`.form-row`/`.input`/`.textarea`/`.field-tip` CSS from `service-teams/form/form.css` (light `:host` + `:host-context(.p-dark)` tokens). Keep under the 20 kB per-component budget.

- [ ] **Step 4: Type-check & commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.

```bash
git add src/app/pages/admin/app-categories/form/
git commit -m "feat(admin): app category create/edit form modal"
```

---

## Task 5: App Categories — list page

**Files:**
- Create: `src/app/pages/admin/app-categories/list/list.ts`
- Create: `src/app/pages/admin/app-categories/list/list.html`
- Create: `src/app/pages/admin/app-categories/list/list.css`

Mirror `inference-provider-types/list/`, but **server-paginated**: call `service.search(query)` inside `load(query)` (do not fetch-all).

- [ ] **Step 1: Write the component TypeScript**

```ts
// src/app/pages/admin/app-categories/list/list.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent, DataTableCellDirective, DataTableGridCardDirective, DataTableColumn } from '@organisms/data-table';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { RowActionsMenuComponent, RowActionsMenuItem } from '@molecules/row-actions-menu/row-actions-menu';
import { SearchParams } from '@interfaces/aaa';
import { AppCategory, CreateAppCategoryDto, UpdateAppCategoryDto } from '@interfaces/app-category.interface';
import { AppCategoryService } from '@services/api/app-category.service';
import { AppCategoryFormComponent } from '../form/form';

@Component({
  selector: 'app-app-categories-list',
  standalone: true,
  imports: [
    DataTableComponent, DataTableCellDirective, DataTableGridCardDirective,
    ConfirmDialogComponent, RowActionsMenuComponent, AppCategoryFormComponent,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCategoriesListComponent {
  private service = inject(AppCategoryService);
  private router = inject(Router);

  protected readonly columns: DataTableColumn[] = [
    { field: 'code', header: 'Code', sortable: true, type: 'template', width: '200px' },
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'status', header: 'Status', sortable: true, type: 'status', width: '140px' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right', width: '120px' },
  ];

  protected readonly rows = signal<AppCategory[]>([]);
  protected readonly totalRecords = signal(0);
  protected readonly loading = signal(false);

  protected readonly isModalVisible = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly current = signal<AppCategory | null>(null);
  protected readonly saving = signal(false);

  protected readonly isDeleteVisible = signal(false);
  protected readonly deleting = signal(false);
  protected readonly pendingDelete = signal<AppCategory | null>(null);

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected get deleteMessage(): string {
    const c = this.pendingDelete();
    return c ? `Delete “${c.name}”? This can’t be undone. Apps assigned to it become uncategorized.` : '';
  }

  load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.search(query).subscribe({
      next: r => { this.rows.set(r.items); this.totalRecords.set(r.totalCount); this.loading.set(false); },
      error: () => { this.rows.set([]); this.totalRecords.set(0); this.loading.set(false); },
    });
  }

  private reload(): void { this.load(this.lastQuery); }

  onRowClick(row: unknown): void { this.openDetail(row as AppCategory); }
  openDetail(c: AppCategory): void { this.router.navigate(['/admin/app-categories', c.code]); }

  openCreate(): void { this.isEditing.set(false); this.current.set(null); this.isModalVisible.set(true); }
  openEdit(c: AppCategory): void { this.isEditing.set(true); this.current.set(c); this.isModalVisible.set(true); }

  save(dto: CreateAppCategoryDto | UpdateAppCategoryDto): void {
    this.saving.set(true);
    const done = () => { this.saving.set(false); this.isModalVisible.set(false); this.reload(); };
    if (this.isEditing()) {
      this.service.update(this.current()!.code, dto as UpdateAppCategoryDto).subscribe({ next: done, error: () => this.saving.set(false) });
    } else {
      this.service.create(dto as CreateAppCategoryDto).subscribe({ next: done, error: () => this.saving.set(false) });
    }
  }

  toggleStatus(c: AppCategory): void {
    const status = String(c.status).toUpperCase() === 'ACTIVE' ? 'inactive' : 'active';
    this.service.updateStatus(c.code, { status }).subscribe({ next: () => this.reload() });
  }

  askDelete(c: AppCategory): void { this.pendingDelete.set(c); this.isDeleteVisible.set(true); }
  confirmDelete(): void {
    const c = this.pendingDelete(); if (!c) return;
    this.deleting.set(true);
    this.service.delete(c.code).subscribe({
      next: () => { this.deleting.set(false); this.isDeleteVisible.set(false); this.reload(); },
      error: () => { this.deleting.set(false); this.isDeleteVisible.set(false); },
    });
  }

  menuItems(c: AppCategory): RowActionsMenuItem[] {
    const active = String(c.status).toUpperCase() === 'ACTIVE';
    return [
      { label: 'View detail', icon: 'pi-eye', action: () => this.openDetail(c) },
      { divider: true },
      { label: active ? 'Deactivate' : 'Activate', icon: 'pi-power-off', action: () => this.toggleStatus(c) },
      { label: 'Edit', icon: 'pi-pencil', action: () => this.openEdit(c) },
      { divider: true },
      { label: 'Delete', icon: 'pi-trash', danger: true, action: () => this.askDelete(c) },
    ];
  }
}
```

> Before writing the template, confirm the `RowActionsMenuComponent` export name and import path by reading `src/app/components/molecules/row-actions-menu/`. Use the actual exported symbol; adjust the import if it differs.

- [ ] **Step 2: Write the template**

Mirror `inference-provider-types/list/list.html`:
- `.page-head`: title "App Categories", sub "Buckets that group apps surfaced across the platform.", `.page-actions` with a **disabled** Export `btn` and a `btn btn-primary` "New category" (`(click)="openCreate()"`).
- `<app-data-table [columns]="columns" [data]="rows()" [loading]="loading()" [totalRecords]="totalRecords()" searchPlaceholder="Search by name, code or description…" emptyMessage="No categories match the current filters." initialView="table" (query)="load($event)" (rowClick)="onRowClick($event)">`
  - `[data-table-toolbar]`: a **disabled** Status filter chip placeholder (copy the `.filter-chip` markup from the Workspaces list, `disabled`).
  - `[data-table-toolbar-right]`: `<span class="count">{{ totalRecords() }} categories</span>`.
  - `*appDataCell="code"`: `<span class="code-cell">{{ row.code }}</span>`.
  - `*appDataCell="actions"`: `.row-actions` (`(click)="$event.stopPropagation()"`) with a view button (`pi-eye`, `(click)="openDetail(row)"`) and `<app-row-actions-menu [items]="menuItems(row)" ariaLabel="Category actions" />`.
  - `appDataGridCard`: a `.provider-card` (tag glyph `pi-tag`, name, code, status pill, description, footer) — replicate `app-categories.jsx` `CategoryCard` (lines 283–311).
- `<app-app-category-form [(visible)]="isModalVisible" [isEditing]="isEditing()" [current]="current()" [saving]="saving()" (save)="save($event)" />`
- `<app-confirm-dialog [(visible)]="isDeleteVisible" title="Delete category" [message]="deleteMessage" confirmLabel="Delete" [loading]="deleting()" (confirmed)="confirmDelete()" />`

Use `let row` / `let c` template vars typed via the directive context (no explicit cast needed in the template).

- [ ] **Step 3: Write the CSS**

Copy `.page-head`, `.page-actions`, `.btn`, `.code-cell`, `.row-actions`, `.filter-chip`, `.count`, `.provider-card`/`.pc-*` from `inference-provider-types/list/list.css` + the Workspaces list (for the filter chip). Light + `.p-dark`.

- [ ] **Step 4: Type-check & commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.

```bash
git add src/app/pages/admin/app-categories/list/
git commit -m "feat(admin): App Categories list (server-paginated, table+grid)"
```

---

## Task 6: App Categories — detail page (edit-in-place)

**Files:**
- Create: `src/app/pages/admin/app-categories/details/details.ts`
- Create: `src/app/pages/admin/app-categories/details/details.html`
- Create: `src/app/pages/admin/app-categories/details/details.css`

Mirror `service-teams/details/`.

- [ ] **Step 1: Write the component TypeScript**

```ts
// src/app/pages/admin/app-categories/details/details.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CopyIdButtonComponent } from '@atoms/copy-id-button/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { AppCategory } from '@interfaces/app-category.interface';
import { AppCategoryService } from '@services/api/app-category.service';

@Component({
  selector: 'app-app-category-details',
  standalone: true,
  imports: [ReactiveFormsModule, CopyIdButtonComponent, ConfirmDialogComponent],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCategoryDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AppCategoryService);
  private fb = inject(FormBuilder);

  protected readonly category = signal<AppCategory | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly savedPulse = signal(false);
  protected readonly isDeleteVisible = signal(false);
  protected readonly deleting = signal(false);

  protected readonly isActive = computed(() => String(this.category()?.status).toUpperCase() === 'ACTIVE');

  protected readonly editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  constructor() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) this.load(code);
  }

  private load(code: string): void {
    this.loading.set(true);
    this.service.getByCode(code).subscribe({
      next: c => { this.category.set(c); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  goBack(): void { this.router.navigate(['/admin/app-categories']); }

  startEdit(): void {
    const c = this.category(); if (!c) return;
    this.editForm.reset({ name: c.name, description: c.description ?? '' });
    this.editing.set(true);
  }
  cancelEdit(): void { this.editing.set(false); }

  saveEdit(): void {
    const c = this.category(); if (!c || this.editForm.invalid) return;
    const v = this.editForm.getRawValue();
    this.saving.set(true);
    this.service.update(c.code, { name: v.name.trim(), description: v.description.trim() || null }).subscribe({
      next: () => {
        this.category.set({ ...c, name: v.name.trim(), description: v.description.trim() || null });
        this.saving.set(false); this.editing.set(false);
        this.savedPulse.set(true); setTimeout(() => this.savedPulse.set(false), 2200);
      },
      error: () => this.saving.set(false),
    });
  }

  toggleStatus(): void {
    const c = this.category(); if (!c) return;
    const status = this.isActive() ? 'inactive' : 'active';
    this.service.updateStatus(c.code, { status }).subscribe({
      next: () => this.category.set({ ...c, status }),
    });
  }

  askDelete(): void { this.isDeleteVisible.set(true); }
  confirmDelete(): void {
    const c = this.category(); if (!c) return;
    this.deleting.set(true);
    this.service.delete(c.code).subscribe({
      next: () => { this.deleting.set(false); this.goBack(); },
      error: () => { this.deleting.set(false); this.isDeleteVisible.set(false); },
    });
  }
}
```

- [ ] **Step 2: Write the template**

Mirror `service-teams/details/details.html` and `app-categories.jsx` detail (lines 594–757):
- `.back-link` (`pi-arrow-left`, `(click)="goBack()"`) → "Back to App Categories".
- `@if (loading()) {…} @else if (error() || !category()) { not-found placeholder } @else { … }`.
- `.page-head`: tag avatar (`pi-tag`), `.title-row` with `.page-title` = name, status pill (`.pill.pill-ok`/`.pill-off`), an `EDITING` `.pill-draft` while `editing()`; `.page-sub` shows the `code` (mono). `.page-actions`: `<app-copy-id-button [value]="category()!.code" [compact]="false" label="Copy code" />` (hidden while editing).
- `.detail-grid`: Information `.card` with `.card-head` ("Information" + `SAVED` pill when `savedPulse()` + Edit `btn` when not editing). Body swaps:
  - read-only `<dl class="field-grid">`: Code (`.code` pill), Name, Description (full row; `—` when empty).
  - editing `<form [formGroup]="editForm">`: Name (required), Code shown **read-only/disabled** (display `category()!.code`, not a form control), Description; `.setup-actions` with Save (`[disabled]="editForm.invalid || editForm.pristine || saving()"`) + Cancel.
- aside `.side`: a Metadata card (only fields the API returns from Task 0 — Status; created/updated only if present) and a "Quick actions" card (`opacity` dimmed while editing) with Activate/Deactivate (`(click)="toggleStatus()"`) and Delete (`btn btn-danger`, `(click)="askDelete()"`).
- `<app-confirm-dialog [(visible)]="isDeleteVisible" title="Delete category" [message]="'Delete this category? This can’t be undone.'" confirmLabel="Delete" [loading]="deleting()" (confirmed)="confirmDelete()" />`

- [ ] **Step 3: Write the CSS**

Copy `.back-link`, `.page-head`, `.title-row`, `.pill*`, `.detail-grid`, `.card`, `.card-head`, `.field-grid`, `.setup-actions`, `.side`, `.meta-row`, `.zone-row` from `service-teams/details/details.css`. Light + `.p-dark`.

- [ ] **Step 4: Type-check, build, commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.
Run: `npm run build` → succeeds within budgets.

```bash
git add src/app/pages/admin/app-categories/details/
git commit -m "feat(admin): App Category detail (edit-in-place + quick actions)"
```

- [ ] **Step 5: Verify in browser**

`npm start`; navigate to `/admin/app-categories`. Confirm via Playwright preview: list loads from API, search/sort/paginate hit the API, create/edit modal saves, row menu toggles status & deletes, row click → detail, detail edit-in-place saves, delete returns to list. Take a screenshot of the list + detail (light & `.p-dark`).

---

## Task 7: Install Monaco + Brandbot Apps interfaces, service, routes

**Files:**
- Modify: `package.json` (deps), `angular.json` (assets), `src/app/app.config.ts` (provider)
- Create: `src/app/shared/interfaces/brandbot-app.interface.ts` (+ barrel export)
- Create: `src/app/shared/services/api/brandbot-app.service.ts` (+ `.spec.ts`)
- Modify: `src/app/app.routes.ts` (brandbot-apps routes)

- [ ] **Step 1: Install Monaco**

Run: `npm i monaco-editor@^0.55 ngx-monaco-editor-v2@21.1.4`
Expected: installs cleanly (peer `@angular/core ^21.1.4` satisfied by `^21.2.9`).

- [ ] **Step 2: Register Monaco assets in `angular.json`**

In the build target's `assets` array (and the `test` target's if it has one), add:

```json
{ "glob": "**/*", "input": "node_modules/monaco-editor", "output": "/assets/monaco/" }
```

- [ ] **Step 3: Provide the editor module in `app.config.ts`**

Add the import and provider:

```ts
import { importProvidersFrom } from '@angular/core';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
// inside providers: [...]
importProvidersFrom(MonacoEditorModule.forRoot()),
```

- [ ] **Step 4: Write the Brandbot App interfaces**

```ts
// src/app/shared/interfaces/brandbot-app.interface.ts

/** Read-model. Adjust to the verified shape from Task 0 (esp. picture field & timestamps). */
export interface BrandbotApp {
  id: string;
  name: string;
  description?: string | null;
  type?: string | null;
  version?: string | null;
  regionName?: string | null;
  regionCode?: string | null;
  allowedSubDomainCreation?: boolean | null;
  baseDomain?: string | null;
  loadBalancerName?: string | null;
  domainZoneId?: string | null;
  preferenceModule?: string | null;
  jsonSettingsName?: string | null;
  settings?: string | null;
  picture?: string | null;
  defaultUrl?: string | null;
  downloadUrl?: string | null;
  downloadManualUrl?: string | null;
  category?: string | null;
  preferences?: string | null;
  developer?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandbotAppDto {
  instanceId: string;
  name: string;
  description?: string | null;
  type?: string | null;
  version?: string | null;
  regionName?: string | null;
  regionCode?: string | null;
  allowedSubDomainCreation: boolean;
  baseDomain?: string | null;
  loadBalancerName?: string | null;
  domainZoneId?: string | null;
  preferenceModule?: string | null;
  jsonSettingsName?: string | null;
  settings?: string | null;
  picture?: string | null;
  defaultUrl?: string | null;
  downloadUrl?: string | null;
  downloadManualUrl?: string | null;
  category?: string | null;
  preferences?: string | null;
  developer?: string | null;
}

export type UpdateBrandbotAppDto = Omit<CreateBrandbotAppDto, 'instanceId' | 'allowedSubDomainCreation'> & {
  allowedSubDomainCreation?: boolean | null;
};

export interface UpdateBrandbotAppPreferencesDto { preferences: string; }
export interface UpdateBrandbotAppStatusDto { status: string; }

export const APP_TYPES = ['WEB', 'BACKEND', 'MOBILE', 'PLUGIN'] as const;
```

Add to `src/app/shared/interfaces/index.ts`: `export * from './brandbot-app.interface';`

- [ ] **Step 5: Write the failing service spec**

```ts
// src/app/shared/services/api/brandbot-app.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { environment } from '@env/environment';
import { BrandbotAppService } from './brandbot-app.service';

describe('BrandbotAppService', () => {
  let service: BrandbotAppService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/brandbot-apps`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), BrandbotAppService],
    });
    service = TestBed.inject(BrandbotAppService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('search() maps params to PascalCase', () => {
    service.search({ pageNumber: 1, pageSize: 20, searchString: 'help' }).subscribe();
    const req = http.expectOne(r => r.url === base);
    expect(req.request.params.get('PageNumber')).toBe('1');
    expect(req.request.params.get('PageSize')).toBe('20');
    expect(req.request.params.get('SearchString')).toBe('help');
    req.flush({ items: [], totalCount: 0, pageNumber: 1, pageSize: 20 });
  });

  it('create() POSTs with instanceId', () => {
    service.create({ instanceId: 'i1', name: 'Help', allowedSubDomainCreation: false }).subscribe();
    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.instanceId).toBe('i1');
    req.flush({ id: 'a1', name: 'Help', status: 'ACTIVE' });
  });

  it('updatePreferences() PUTs /{id}/preferences', () => {
    service.updatePreferences('a1', { preferences: '{}' }).subscribe();
    const req = http.expectOne(`${base}/a1/preferences`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('updatePicture() PUTs multipart to /{id}/picture', () => {
    service.updatePicture('a1', new File(['x'], 'icon.png', { type: 'image/png' })).subscribe();
    const req = http.expectOne(`${base}/a1/picture`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(null);
  });

  it('updateStatus() PUTs /{id}/status', () => {
    service.updateStatus('a1', { status: 'inactive' }).subscribe();
    const req = http.expectOne(`${base}/a1/status`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('delete() DELETEs /{id}', () => {
    service.delete('a1').subscribe();
    const req = http.expectOne(`${base}/a1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
```

Run: `npx ng test --include='src/app/shared/services/api/brandbot-app.service.spec.ts' --watch=false` → FAIL (module not found).

- [ ] **Step 6: Implement the service**

```ts
// src/app/shared/services/api/brandbot-app.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PagedResult, SearchParams } from '@interfaces/aaa';
import {
  BrandbotApp, CreateBrandbotAppDto, UpdateBrandbotAppDto,
  UpdateBrandbotAppPreferencesDto, UpdateBrandbotAppStatusDto,
} from '@interfaces/brandbot-app.interface';

@Injectable({ providedIn: 'root' })
export class BrandbotAppService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/brandbot-apps`;

  search(params: SearchParams): Observable<PagedResult<BrandbotApp>> {
    let p = new HttpParams().set('PageNumber', params.pageNumber).set('PageSize', params.pageSize);
    if (params.searchString) p = p.set('SearchString', params.searchString);
    if (params.sortColumn) p = p.set('SortColumn', params.sortColumn);
    if (params.sortOrder) p = p.set('SortOrder', params.sortOrder);
    return this.http.get<PagedResult<BrandbotApp>>(this.baseUrl, { params: p });
  }

  getById(id: string): Observable<BrandbotApp> {
    return this.http.get<BrandbotApp>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateBrandbotAppDto): Observable<BrandbotApp> {
    return this.http.post<BrandbotApp>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateBrandbotAppDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  updatePreferences(id: string, dto: UpdateBrandbotAppPreferencesDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/preferences`, dto);
  }

  updateStatus(id: string, dto: UpdateBrandbotAppStatusDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, dto);
  }

  updatePicture(id: string, file: File): Observable<void> {
    const fd = new FormData();
    fd.append('Picture', file, file.name);
    return this.http.put<void>(`${this.baseUrl}/${id}/picture`, fd);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

> The multipart field name (`Picture`) is the best guess; if Task 0 / the swagger `multipart` schema names it differently, correct it.

Run the spec → PASS (6 specs).

- [ ] **Step 7: Add the routes**

In `app.routes.ts` admin children, after the `app-categories/:code` line:

```ts
{ path: 'brandbot-apps', loadComponent: () => import('./pages/admin/brandbot-apps/list/list').then(m => m.BrandbotAppsListComponent) },
{ path: 'brandbot-apps/:id', loadComponent: () => import('./pages/admin/brandbot-apps/details/details').then(m => m.BrandbotAppDetailsComponent) },
```

(Resolves after Tasks 8–9 create the components.)

- [ ] **Step 8: Type-check & commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.

```bash
git add package.json package-lock.json angular.json src/app/app.config.ts src/app/app.routes.ts src/app/shared/interfaces/brandbot-app.interface.ts src/app/shared/interfaces/index.ts src/app/shared/services/api/brandbot-app.service.ts src/app/shared/services/api/brandbot-app.service.spec.ts
git commit -m "feat(api): Monaco editor + BrandbotAppService, interfaces, routes"
```

---

## Task 8: Brandbot Apps — create form modal

**Files:**
- Create: `src/app/pages/admin/brandbot-apps/form/form.ts` / `.html` / `.css`

Wide native modal, sectioned (Basics / Instance / Region & domain / URLs / Settings), mirroring `apps.jsx` `AppCreateModal` (lines 521–683). The Category select is populated from real active App Categories; the Instance select from the instances endpoint.

- [ ] **Step 1: Confirm the instances list call**

Read `src/app/shared/services/api/aaa/instance.service.ts` and `src/app/shared/interfaces/aaa/instance.interface.ts`. Identify the method that returns a list of instances and the item's id/name fields. Use that method name and field names in Step 2 (replace `instanceService.search(...)` / `inst.id` / `inst.name` below with the real ones).

- [ ] **Step 2: Write the component TypeScript**

```ts
// src/app/pages/admin/brandbot-apps/form/form.ts
import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateBrandbotAppDto, APP_TYPES } from '@interfaces/brandbot-app.interface';
import { AppCategory } from '@interfaces/app-category.interface';
import { AppCategoryService } from '@services/api/app-category.service';
import { InstanceService } from '@services/api/aaa/instance.service';

@Component({
  selector: 'app-brandbot-app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandbotAppFormComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(AppCategoryService);
  private instanceService = inject(InstanceService);

  readonly visible = model(false);
  readonly saving = input(false);
  readonly save = output<CreateBrandbotAppDto>();

  protected readonly appTypes = APP_TYPES;
  protected readonly categories = signal<AppCategory[]>([]);
  protected readonly instances = signal<{ id: string; name: string }[]>([]);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    version: ['0.1.0', [Validators.required]],
    description: [''],
    type: ['WEB', Validators.required],
    category: [''],
    developer: [''],
    instanceId: ['', Validators.required],
    regionName: [''], regionCode: [''], baseDomain: [''],
    loadBalancerName: [''], domainZoneId: [''], allowedSubDomainCreation: [false],
    defaultUrl: [''], downloadUrl: [''], downloadManualUrl: [''],
    preferenceModule: [''], jsonSettingsName: [''], settings: [''], preferences: [''],
  });

  constructor() {
    effect(() => {
      if (!this.visible()) return;
      this.form.reset({ version: '0.1.0', type: 'WEB', allowedSubDomainCreation: false });
      // Load active categories (first page, large size) and instances for the pickers.
      this.categoryService.search({ pageNumber: 1, pageSize: 200 })
        .subscribe(r => this.categories.set(r.items.filter(c => String(c.status).toUpperCase() === 'ACTIVE')));
      // Replace with the real instances list call confirmed in Step 1:
      this.instanceService.search({ pageNumber: 1, pageSize: 200 })
        .subscribe(r => this.instances.set(r.items.map(i => ({ id: i.id, name: i.name }))));
    });
  }

  close(): void { this.visible.set(false); }

  private nz(v: string): string | null { return v.trim() || null; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.save.emit({
      instanceId: v.instanceId,
      name: v.name.trim(),
      version: this.nz(v.version),
      description: this.nz(v.description),
      type: v.type,
      category: this.nz(v.category),
      developer: this.nz(v.developer),
      regionName: this.nz(v.regionName),
      regionCode: this.nz(v.regionCode),
      baseDomain: this.nz(v.baseDomain),
      loadBalancerName: this.nz(v.loadBalancerName),
      domainZoneId: this.nz(v.domainZoneId),
      allowedSubDomainCreation: v.allowedSubDomainCreation,
      defaultUrl: this.nz(v.defaultUrl),
      downloadUrl: this.nz(v.downloadUrl),
      downloadManualUrl: this.nz(v.downloadManualUrl),
      preferenceModule: this.nz(v.preferenceModule),
      jsonSettingsName: this.nz(v.jsonSettingsName),
      settings: this.nz(v.settings),
      preferences: this.nz(v.preferences),
    });
  }
}
```

> Adjust the `instanceService` method/field names per Step 1. If `InstanceService` uses the legacy `PaginatedList` envelope (`items`/`totalItems`) instead of `PagedResult`, map accordingly.

- [ ] **Step 3: Write the template**

Mirror `apps.jsx` `AppCreateModal` (lines 550–681) and the `service-teams/form` modal shell. `[formGroup]="form"`, `.form-divider` section headers. Sections:
- **Basics:** Name (required) | Version (required); Description; Type `<select>` (`@for (t of appTypes; …)`) | Category `<select>` (`@for (c of categories(); …)` value `c.code`); Developer.
- **Instance:** Instance `<select formControlName="instanceId">` (`@for (i of instances(); …)` value `i.id`), required.
- **Region & domain:** regionName | regionCode; baseDomain; loadBalancerName | domainZoneId; `allowedSubDomainCreation` checkbox row.
- **URLs:** defaultUrl; downloadUrl | downloadManualUrl.
- **Settings & preferences:** preferenceModule | jsonSettingsName; settings (mono textarea); preferences (mono textarea — note the rich Monaco editor lives on the detail page).
- `.modal-foot`: Cancel + "Create app" (`[disabled]="form.invalid || saving()"`).

- [ ] **Step 4: Write the CSS**

Reuse the modal/form CSS from Task 4's `form.css` (copy or share the same class set); add `.form-divider`. Keep under budget.

- [ ] **Step 5: Type-check & commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.

```bash
git add src/app/pages/admin/brandbot-apps/form/
git commit -m "feat(admin): Brandbot App create form (category + instance pickers)"
```

---

## Task 9: Brandbot Apps — list page

**Files:**
- Create: `src/app/pages/admin/brandbot-apps/list/list.ts` / `.html` / `.css`

Server-paginated, mirroring Task 5's list with the Brandbot App columns.

- [ ] **Step 1: Write the component TypeScript**

```ts
// src/app/pages/admin/brandbot-apps/list/list.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent, DataTableCellDirective, DataTableGridCardDirective, DataTableColumn } from '@organisms/data-table';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { RowActionsMenuComponent, RowActionsMenuItem } from '@molecules/row-actions-menu/row-actions-menu';
import { SearchParams } from '@interfaces/aaa';
import { BrandbotApp, CreateBrandbotAppDto } from '@interfaces/brandbot-app.interface';
import { BrandbotAppService } from '@services/api/brandbot-app.service';
import { BrandbotAppFormComponent } from '../form/form';

@Component({
  selector: 'app-brandbot-apps-list',
  standalone: true,
  imports: [
    DataTableComponent, DataTableCellDirective, DataTableGridCardDirective,
    ConfirmDialogComponent, RowActionsMenuComponent, BrandbotAppFormComponent,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandbotAppsListComponent {
  private service = inject(BrandbotAppService);
  private router = inject(Router);

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name', pictureField: 'picture' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'type', header: 'Type', sortable: true, type: 'template', width: '110px' },
    { field: 'category', header: 'Category', sortable: true, type: 'template', width: '160px' },
    { field: 'version', header: 'Version', sortable: true, type: 'template', width: '110px' },
    { field: 'defaultUrl', header: 'Default URL', type: 'template' },
    { field: 'developer', header: 'Developer', type: 'text' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right', width: '120px' },
  ];

  protected readonly rows = signal<BrandbotApp[]>([]);
  protected readonly totalRecords = signal(0);
  protected readonly loading = signal(false);
  protected readonly isCreateVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly isDeleteVisible = signal(false);
  protected readonly deleting = signal(false);
  protected readonly pendingDelete = signal<BrandbotApp | null>(null);

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected get deleteMessage(): string {
    const a = this.pendingDelete();
    return a ? `Delete “${a.name}”? Installations will be detached and assets revoked. This can’t be undone.` : '';
  }

  load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.search(query).subscribe({
      next: r => { this.rows.set(r.items); this.totalRecords.set(r.totalCount); this.loading.set(false); },
      error: () => { this.rows.set([]); this.totalRecords.set(0); this.loading.set(false); },
    });
  }
  private reload(): void { this.load(this.lastQuery); }

  onRowClick(row: unknown): void { this.openDetail(row as BrandbotApp); }
  openDetail(a: BrandbotApp): void { this.router.navigate(['/admin/brandbot-apps', a.id]); }
  openEditor(a: BrandbotApp): void { this.router.navigate(['/admin/brandbot-apps', a.id], { queryParams: { edit: 1 } }); }

  openCreate(): void { this.isCreateVisible.set(true); }
  create(dto: CreateBrandbotAppDto): void {
    this.saving.set(true);
    this.service.create(dto).subscribe({
      next: () => { this.saving.set(false); this.isCreateVisible.set(false); this.reload(); },
      error: () => this.saving.set(false),
    });
  }

  toggleStatus(a: BrandbotApp): void {
    const status = String(a.status).toUpperCase() === 'ACTIVE' ? 'inactive' : 'active';
    this.service.updateStatus(a.id, { status }).subscribe({ next: () => this.reload() });
  }

  askDelete(a: BrandbotApp): void { this.pendingDelete.set(a); this.isDeleteVisible.set(true); }
  confirmDelete(): void {
    const a = this.pendingDelete(); if (!a) return;
    this.deleting.set(true);
    this.service.delete(a.id).subscribe({
      next: () => { this.deleting.set(false); this.isDeleteVisible.set(false); this.reload(); },
      error: () => { this.deleting.set(false); this.isDeleteVisible.set(false); },
    });
  }

  menuItems(a: BrandbotApp): RowActionsMenuItem[] {
    const active = String(a.status).toUpperCase() === 'ACTIVE';
    return [
      { label: active ? 'Deactivate' : 'Activate', icon: 'pi-power-off', action: () => this.toggleStatus(a) },
      { label: 'Editor', icon: 'pi-pencil', action: () => this.openEditor(a) },
      { divider: true },
      { label: 'Delete', icon: 'pi-trash', danger: true, action: () => this.askDelete(a) },
    ];
  }
}
```

- [ ] **Step 2: Write the template**

Mirror Task 5's list + `apps.jsx` list (lines 811–931):
- `.page-head`: "Brandbot Apps" / "Apps available to install on workspaces across the platform." + disabled Export + "New app" (`(click)="openCreate()"`).
- `<app-data-table>` bound as in Task 5 (searchPlaceholder "Search by name, description or developer…", emptyMessage "No apps match the current filters.").
  - `[data-table-toolbar]`: **disabled** Status, Type, Category filter-chip placeholders.
  - `[data-table-toolbar-right]`: `{{ totalRecords() }} apps`.
  - `*appDataCell="type"`: `<span class="pill pill-type">{{ row.type }}</span>`.
  - `*appDataCell="category"`: `<span class="mono-cell">{{ row.category || '—' }}</span>`.
  - `*appDataCell="version"`: `<span class="mono-cell">v{{ row.version }}</span>`.
  - `*appDataCell="defaultUrl"`: `@if (row.defaultUrl) { <a [href]="row.defaultUrl" target="_blank" rel="noreferrer" (click)="$event.stopPropagation()">{{ row.defaultUrl }}</a> } @else { <span class="empty-dash">—</span> }`.
  - `*appDataCell="actions"`: view button + `<app-row-actions-menu [items]="menuItems(row)" ariaLabel="App actions" />`.
  - `appDataGridCard`: replicate `apps.jsx` `AppCard` (lines 686–712) — logo (img `row.picture` else initials), name, `category · v{version}`, status pill, description, footer `developer · type`.
- `<app-brandbot-app-form [(visible)]="isCreateVisible" [saving]="saving()" (save)="create($event)" />`
- `<app-confirm-dialog [(visible)]="isDeleteVisible" title="Delete app" [message]="deleteMessage" confirmLabel="Delete" [loading]="deleting()" (confirmed)="confirmDelete()" />`

- [ ] **Step 3: Write the CSS**

Copy Task 5's list CSS; add `.pill-type`, `.mono-cell`, `.empty-dash` from `apps.jsx`'s styling intent (mono font, muted). Light + `.p-dark`.

- [ ] **Step 4: Type-check, build, commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors. Run: `npm run build` → within budgets.

```bash
git add src/app/pages/admin/brandbot-apps/list/
git commit -m "feat(admin): Brandbot Apps list (server-paginated, table+grid)"
```

---

## Task 10: Brandbot Apps — detail page (tabs, edit-in-place, image, Monaco preferences)

**Files:**
- Create: `src/app/pages/admin/brandbot-apps/details/details.ts` / `.html` / `.css`

Mirror `service-teams/details/` shell + `apps.jsx` detail (lines 937–1491). Three independent save flows: main fields (PUT update), image (PUT picture), preferences (PUT preferences).

- [ ] **Step 1: Write the component TypeScript**

```ts
// src/app/pages/admin/brandbot-apps/details/details.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CopyIdButtonComponent } from '@atoms/copy-id-button/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { FileUploadComponent } from '@molecules/file-upload/file-upload';
import { BrandbotApp, UpdateBrandbotAppDto, APP_TYPES } from '@interfaces/brandbot-app.interface';
import { AppCategory } from '@interfaces/app-category.interface';
import { BrandbotAppService } from '@services/api/brandbot-app.service';
import { AppCategoryService } from '@services/api/app-category.service';

@Component({
  selector: 'app-brandbot-app-details',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, MonacoEditorModule,
    CopyIdButtonComponent, ConfirmDialogComponent, FileUploadComponent,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandbotAppDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(BrandbotAppService);
  private categoryService = inject(AppCategoryService);
  private fb = inject(FormBuilder);

  protected readonly appTypes = APP_TYPES;
  protected readonly categories = signal<AppCategory[]>([]);
  protected readonly app = signal<BrandbotApp | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly tab = signal<'info' | 'preferences'>('info');

  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly savedPulse = signal(false);

  protected readonly prefsDraft = signal('');
  protected readonly prefsSaving = signal(false);
  protected readonly prefsSavedPulse = signal(false);
  protected readonly prefsEditing = signal(false);
  protected readonly editorOptions = { language: 'json', automaticLayout: true, minimap: { enabled: false }, theme: 'vs-dark' };

  protected readonly pendingImage = signal<File | null>(null);
  protected readonly imageSaving = signal(false);
  protected readonly imageSavedPulse = signal(false);

  protected readonly isDeleteVisible = signal(false);
  protected readonly deleting = signal(false);

  protected readonly isActive = computed(() => String(this.app()?.status).toUpperCase() === 'ACTIVE');

  protected readonly editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    version: ['', Validators.required],
    description: [''], type: ['WEB'], category: [''], developer: [''],
    regionName: [''], regionCode: [''], baseDomain: [''],
    loadBalancerName: [''], domainZoneId: [''], allowedSubDomainCreation: [false],
    defaultUrl: [''], downloadUrl: [''], downloadManualUrl: [''],
    preferenceModule: [''], jsonSettingsName: [''], settings: [''],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const wantEdit = this.route.snapshot.queryParamMap.get('edit') === '1';
    this.categoryService.search({ pageNumber: 1, pageSize: 200 })
      .subscribe(r => this.categories.set(r.items.filter(c => String(c.status).toUpperCase() === 'ACTIVE')));
    if (id) this.load(id, wantEdit);
  }

  private load(id: string, wantEdit = false): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: a => {
        this.app.set(a);
        this.prefsDraft.set(a.preferences ?? '');
        this.loading.set(false);
        if (wantEdit) this.startEdit();
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  goBack(): void { this.router.navigate(['/admin/brandbot-apps']); }
  setTab(t: 'info' | 'preferences'): void { if (!this.editing()) this.tab.set(t); }

  private nz(v: string): string | null { return v.trim() || null; }

  startEdit(): void {
    const a = this.app(); if (!a) return;
    this.editForm.reset({
      name: a.name, version: a.version ?? '', description: a.description ?? '',
      type: a.type ?? 'WEB', category: a.category ?? '', developer: a.developer ?? '',
      regionName: a.regionName ?? '', regionCode: a.regionCode ?? '', baseDomain: a.baseDomain ?? '',
      loadBalancerName: a.loadBalancerName ?? '', domainZoneId: a.domainZoneId ?? '',
      allowedSubDomainCreation: a.allowedSubDomainCreation ?? false,
      defaultUrl: a.defaultUrl ?? '', downloadUrl: a.downloadUrl ?? '', downloadManualUrl: a.downloadManualUrl ?? '',
      preferenceModule: a.preferenceModule ?? '', jsonSettingsName: a.jsonSettingsName ?? '', settings: a.settings ?? '',
    });
    this.tab.set('info');
    this.editing.set(true);
  }
  cancelEdit(): void { this.editing.set(false); }

  saveEdit(): void {
    const a = this.app(); if (!a || this.editForm.invalid) return;
    const v = this.editForm.getRawValue();
    const dto: UpdateBrandbotAppDto = {
      name: v.name.trim(), version: this.nz(v.version), description: this.nz(v.description),
      type: v.type, category: this.nz(v.category), developer: this.nz(v.developer),
      regionName: this.nz(v.regionName), regionCode: this.nz(v.regionCode), baseDomain: this.nz(v.baseDomain),
      loadBalancerName: this.nz(v.loadBalancerName), domainZoneId: this.nz(v.domainZoneId),
      allowedSubDomainCreation: v.allowedSubDomainCreation,
      defaultUrl: this.nz(v.defaultUrl), downloadUrl: this.nz(v.downloadUrl), downloadManualUrl: this.nz(v.downloadManualUrl),
      preferenceModule: this.nz(v.preferenceModule), jsonSettingsName: this.nz(v.jsonSettingsName), settings: this.nz(v.settings),
    };
    this.saving.set(true);
    this.service.update(a.id, dto).subscribe({
      next: () => {
        this.app.set({ ...a, ...dto });
        this.saving.set(false); this.editing.set(false);
        this.savedPulse.set(true); setTimeout(() => this.savedPulse.set(false), 2200);
      },
      error: () => this.saving.set(false),
    });
  }

  // Preferences (independent)
  startPrefsEdit(): void { this.prefsDraft.set(this.app()?.preferences ?? ''); this.prefsEditing.set(true); }
  cancelPrefsEdit(): void { this.prefsEditing.set(false); }
  savePrefs(): void {
    const a = this.app(); if (!a) return;
    this.prefsSaving.set(true);
    this.service.updatePreferences(a.id, { preferences: this.prefsDraft() }).subscribe({
      next: () => {
        this.app.set({ ...a, preferences: this.prefsDraft() });
        this.prefsSaving.set(false); this.prefsEditing.set(false);
        this.prefsSavedPulse.set(true); setTimeout(() => this.prefsSavedPulse.set(false), 2200);
      },
      error: () => this.prefsSaving.set(false),
    });
  }

  // Image (independent)
  onImagePicked(files: File[]): void { this.pendingImage.set(files[0] ?? null); }
  saveImage(): void {
    const a = this.app(); const f = this.pendingImage(); if (!a || !f) return;
    this.imageSaving.set(true);
    this.service.updatePicture(a.id, f).subscribe({
      next: () => {
        this.imageSaving.set(false); this.pendingImage.set(null);
        this.imageSavedPulse.set(true); setTimeout(() => this.imageSavedPulse.set(false), 2200);
        this.load(a.id); // refresh picture URL
      },
      error: () => this.imageSaving.set(false),
    });
  }

  toggleStatus(): void {
    const a = this.app(); if (!a) return;
    const status = this.isActive() ? 'inactive' : 'active';
    this.service.updateStatus(a.id, { status }).subscribe({ next: () => this.app.set({ ...a, status }) });
  }

  askDelete(): void { this.isDeleteVisible.set(true); }
  confirmDelete(): void {
    const a = this.app(); if (!a) return;
    this.deleting.set(true);
    this.service.delete(a.id).subscribe({
      next: () => { this.deleting.set(false); this.goBack(); },
      error: () => { this.deleting.set(false); this.isDeleteVisible.set(false); },
    });
  }
}
```

> Confirm the `FileUploadComponent` export name/path and `(fileSelected)` output by reading `src/app/components/molecules/file-upload/`. Adjust the import/binding to match.

- [ ] **Step 2: Write the template**

Mirror `service-teams/details/details.html` shell + `apps.jsx` detail (lines 1288–1491):
- `.back-link` → "Back to Brandbot Apps".
- loading / not-found guards.
- `.page-head`: avatar (img `app()!.picture` else initials), title-row (name, status pill, type pill, `EDITING` pill while editing), sub (`v… · category · developer`), `app-copy-id-button` of `app()!.id` (hidden while editing).
- `.tabs`: Information / Preferences buttons (`(click)="setTab('info'/'preferences')"`, `.active`, Preferences locked while editing).
- `.detail-grid` main column:
  - **info tab:** Image `.card` (`<app-file-upload variant="default" accept="image/*" (fileSelected)="onImagePicked($event)" />`, current image preview, Save image when `pendingImage()`, `SAVED` pulse); then **read-only** General/Region&domain/Settings cards (`field-grid`) OR the **Editor** form when `editing()` — replicate `RoView` (lines 1041–1179) and `EditView` (lines 1183–1285). Save (`[disabled]="editForm.invalid || editForm.pristine || saving()"`) + Cancel.
  - **preferences tab:** a `.card` — read-only shows `<ngx-monaco-editor [options]="{...readOnly:true}" [ngModel]="app()!.preferences || ''" />` (or a formatted `<pre>`); Edit swaps to `<ngx-monaco-editor [options]="editorOptions" [(ngModel)]="prefsDraft" />` with Save/Cancel + `SAVED` pulse.
- aside `.side`: Metadata card (Status, Type, Version, Developer, timestamps if present) + Quick actions card (Activate/Deactivate, Editor → `startEdit()`, Open app if `defaultUrl`, Delete) dimmed while editing.
- `<app-confirm-dialog [(visible)]="isDeleteVisible" title="Delete app" [message]="'Delete this app? This can’t be undone.'" confirmLabel="Delete" [loading]="deleting()" (confirmed)="confirmDelete()" />`

Drive Monaco's dark theme off `.p-dark` (e.g. read theme in TS or set `editorOptions.theme` based on `document.documentElement.classList.contains('p-dark')`). Keep it simple: default to `vs-dark` (the app's default surface is dark).

- [ ] **Step 3: Write the CSS**

Copy the detail CSS from `service-teams/details/details.css` (back-link, page-head, tabs, detail-grid, card, field-grid, side, meta-row, zone-row, pill*). Add an editor container height (`.ngx-monaco-editor, ngx-monaco-editor { height: 360px; display:block; }`). **Watch the 20 kB per-component CSS error budget** — if exceeded, trim duplicate tokens. Light + `.p-dark`.

- [ ] **Step 4: Type-check, build, commit**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.
Run: `npm run build` → succeeds within budgets (resolve any CSS-budget error before committing).

```bash
git add src/app/pages/admin/brandbot-apps/details/
git commit -m "feat(admin): Brandbot App detail (tabs, edit-in-place, image, Monaco preferences)"
```

---

## Task 11: End-to-end verification & docs

**Files:**
- Modify: `REDESIGN.md` (mark both modules done)

- [ ] **Step 1: Full type-check, build, and unit tests**

Run: `npx tsc -p tsconfig.app.json --noEmit` → no errors.
Run: `npm run build` → succeeds within budgets.
Run: `npx ng test --include='src/app/shared/services/api/app-category.service.spec.ts' --watch=false` and the brandbot-app spec → all PASS.

- [ ] **Step 2: Browser verification (`npm start`, Playwright preview)**

Verify against staging, logged in:
- **App Categories:** list loads; search/sort/paginate hit the API; New category creates; row menu Activate/Deactivate + Edit + Delete work; row click → detail; detail edit-in-place saves; quick-actions toggle & delete.
- **Brandbot Apps:** list loads with all columns; New app modal (category + instance pickers populated) creates with `instanceId`; detail tabs switch; Editor saves; image upload saves via picture endpoint; Monaco preferences edit + save; quick actions work.
- Check **dark mode** (`.p-dark`) on both lists + details. Screenshot list + detail (light & dark) for each module.

- [ ] **Step 3: Update REDESIGN.md**

In `REDESIGN.md`, move both modules from "To do" to "Done" with a one-line summary each (mirroring existing entries), and note the new `monaco-editor`/`ngx-monaco-editor-v2` dependency + `MonacoEditorModule.forRoot()` wiring.

```bash
git add REDESIGN.md
git commit -m "docs: mark App Categories & Brandbot Apps redesign as done"
```

---

## Self-review notes (for the implementer)
- **`code` immutable:** App Category edit never sends/locks `code` (Tasks 4 & 6).
- **Status casing:** writes use lowercase `active`/`inactive`; all display comparisons use `.toUpperCase()` (resilient to either casing from the API).
- **Server pagination:** lists call `service.search(query)` inside `(query)` — never fetch-all + client-filter (that would break paging). Filter chips are disabled placeholders because the API exposes no filter params.
- **Three independent saves** on the Brandbot App detail (fields / image / preferences) map to three distinct endpoints.
- **Verify-before-code:** Task 0 (response shapes), Task 7 Step 1 (picture multipart field), Task 8 Step 1 (instances list call), and the `RowActionsMenu`/`FileUpload` export confirmations are explicit gates — do them rather than assuming.
```
