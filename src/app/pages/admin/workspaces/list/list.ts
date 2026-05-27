import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { InstanceService } from '@services/api/aaa/instance.service';
import { Instance, PaginatedList } from '@interfaces/aaa';

const PAGE_SIZE = 10;
type SortOrder = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

@Component({
  selector: 'app-admin-workspaces-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminWorkspacesListComponent {
  private service = inject(InstanceService);
  private router = inject(Router);

  protected readonly workspaces = signal<Instance[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageNumber = signal<number>(1);
  protected readonly pageSize = signal<number>(PAGE_SIZE);
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<SortOrder>('asc');
  protected readonly view = signal<ViewMode>('table');

  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });

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
      .subscribe(() => this.goToPage(1));
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.service
      .getAll({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        searchString: this.searchControl.value.trim() || undefined,
        sortColumn: this.sortColumn() ?? undefined,
        sortOrder: this.sortColumn() ? this.sortOrder() : undefined
      })
      .subscribe({
        next: (page: PaginatedList<Instance>) => {
          this.workspaces.set(page.items ?? []);
          this.totalRecords.set(page.totalItems ?? 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  protected toggleSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortOrder.update(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortOrder.set('asc');
    }
    this.goToPage(1);
  }

  protected goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.lastPage());
    this.pageNumber.set(target);
    this.load();
  }

  protected setPerPage(rows: number): void {
    this.pageSize.set(rows);
    this.goToPage(1);
  }

  protected setView(view: ViewMode): void {
    this.view.set(view);
  }

  protected open(workspace: Instance): void {
    this.router.navigate(['/admin/workspaces', workspace.id]);
  }

  protected initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+|\./).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
