import {
  Component,
  OnInit,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  input,
  output,
  signal
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { SearchParams } from '@interfaces/aaa';
import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { DataTableColumn } from './data-table.interface';
import { DataTableCellDirective, DataTableGridCardDirective } from './data-table.directives';

type ViewMode = 'table' | 'grid';

/**
 * Redesigned, config-driven table organism for the admin lists.
 *
 * Owns its own pagination / search / sort / view state and emits a single
 * `(query)` event (a `SearchParams`) whenever that state changes — including
 * once on init — so the parent only has to fetch and feed back `data`,
 * `totalRecords` and `loading`.
 *
 * @example
 * <app-data-table
 *   [columns]="columns" [data]="rows()" [loading]="loading()"
 *   [totalRecords]="total()" (query)="load($event)" (rowClick)="open($event)">
 *   <button data-table-toolbar class="…">…</button>
 *   <ng-template appDataGridCard let-row>…</ng-template>
 * </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet, ReactiveFormsModule, CopyIdButtonComponent],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class DataTableComponent implements OnInit {
  readonly columns = input<DataTableColumn[]>([]);
  readonly data = input<unknown[]>([]);
  readonly loading = input<boolean>(false);
  readonly totalRecords = input<number>(0);
  readonly pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  readonly initialPageSize = input<number>(10);
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search…');
  readonly initialView = input<ViewMode>('table');
  readonly rowClickable = input<boolean>(true);
  readonly dataKey = input<string>('id');
  readonly emptyMessage = input<string>('No records found.');

  readonly query = output<SearchParams>();
  readonly rowClick = output<unknown>();

  private readonly cellTemplates = contentChildren(DataTableCellDirective);
  private readonly gridCard = contentChild(DataTableGridCardDirective);

  protected readonly pageNumber = signal<number>(1);
  protected readonly pageSize = signal<number>(10);
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');
  protected readonly view = signal<ViewMode>('table');

  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });

  protected readonly hasGrid = computed(() => !!this.gridCard());
  protected readonly lastPage = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / this.pageSize()))
  );
  protected readonly from = computed(() =>
    this.totalRecords() === 0 ? 0 : (this.pageNumber() - 1) * this.pageSize() + 1
  );
  protected readonly to = computed(() =>
    Math.min(this.totalRecords(), this.pageNumber() * this.pageSize())
  );
  protected readonly pageNums = computed(() => {
    const last = this.lastPage();
    const start = Math.max(1, Math.min(this.pageNumber() - 2, last - 4));
    const nums: number[] = [];
    for (let i = 0; i < 5 && start + i <= last; i++) nums.push(start + i);
    return nums;
  });

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.pageNumber.set(1);
        this.emit();
      });
  }

  ngOnInit(): void {
    this.pageSize.set(this.initialPageSize());
    this.view.set(this.initialView());
    this.emit();
  }

  protected toggleSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortOrder.update(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortOrder.set('asc');
    }
    this.pageNumber.set(1);
    this.emit();
  }

  protected goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.lastPage());
    if (target === this.pageNumber()) return;
    this.pageNumber.set(target);
    this.emit();
  }

  protected setPerPage(rows: number): void {
    this.pageSize.set(rows);
    this.pageNumber.set(1);
    this.emit();
  }

  protected setView(view: ViewMode): void {
    this.view.set(view);
  }

  protected onRowClick(row: unknown): void {
    if (this.rowClickable()) this.rowClick.emit(row);
  }

  protected cellTemplate(field: string): TemplateRef<unknown> | null {
    return this.cellTemplates().find(c => c.appDataCell() === field)?.template ?? null;
  }

  protected gridCardTemplate(): TemplateRef<unknown> | null {
    return this.gridCard()?.template ?? null;
  }

  protected text(row: unknown, col: DataTableColumn): string | null {
    const raw = col.value ? col.value(row) : this.fieldValue(row, col.field);
    return raw === null || raw === undefined || raw === '' ? null : String(raw);
  }

  protected isActive(row: unknown, col: DataTableColumn): boolean {
    const raw = this.fieldValue(row, col.field);
    return String(raw ?? '').toUpperCase() === 'ACTIVE';
  }

  protected statusLabel(row: unknown, col: DataTableColumn): string {
    const raw = this.fieldValue(row, col.field);
    return raw ? String(raw).toUpperCase() : 'INACTIVE';
  }

  protected initials(value: unknown): string {
    const parts = String(value ?? '').trim().split(/\s+|\./).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  protected rowKey(row: unknown): unknown {
    return this.fieldValue(row, this.dataKey()) ?? row;
  }

  protected idOf(row: unknown): string {
    const raw = this.fieldValue(row, this.dataKey());
    return raw === null || raw === undefined ? '' : String(raw);
  }

  protected fieldValue(row: unknown, field: string): unknown {
    return (row as Record<string, unknown> | null | undefined)?.[field];
  }

  private emit(): void {
    this.query.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      searchString: this.searchControl.value.trim() || undefined,
      sortColumn: this.sortColumn() ?? undefined,
      sortOrder: this.sortColumn() ? this.sortOrder() : undefined
    });
  }
}
