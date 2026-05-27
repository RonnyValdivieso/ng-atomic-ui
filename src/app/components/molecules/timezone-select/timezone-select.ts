import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';

import { ReferenceDataService } from '@services/api/reference-data.service';
import { SimpleTimeZone } from '@interfaces/reference.interface';

const PAGE_SIZE = 50;

/**
 * Searchable, paginated time-zone picker backed by GET /api/time-zones.
 * Two-way binds the selected zone's `timezoneName` via `value`; loads more
 * results on scroll and debounces the search query.
 */
@Component({
  selector: 'app-timezone-select',
  standalone: true,
  imports: [],
  templateUrl: './timezone-select.html',
  styleUrls: ['./timezone-select.css']
})
export class TimezoneSelectComponent {
  readonly value = model<string>('');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select a time zone');

  private readonly api = inject(ReferenceDataService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly search$ = new Subject<string>();

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly items = signal<SimpleTimeZone[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);
  private readonly pageIndex = signal(1);
  private readonly hasNextPage = signal(false);

  protected readonly selectedLabel = computed(() => {
    const v = this.value();
    if (!v) return '';
    const match = this.items().find(tz => (tz.timezoneName ?? tz.name) === v);
    return match ? this.label(match) : v;
  });

  constructor() {
    this.search$
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.loadFirstPage());
  }

  protected label(tz: SimpleTimeZone): string {
    return tz.name || tz.timezoneName || '';
  }

  protected gmtLabel(tz: SimpleTimeZone): string {
    const sign = tz.gmtHours < 0 || tz.gmtMinutes < 0 ? '-' : '+';
    const hh = Math.abs(tz.gmtHours).toString().padStart(2, '0');
    const mm = Math.abs(tz.gmtMinutes).toString().padStart(2, '0');
    return `GMT${sign}${hh}:${mm}`;
  }

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.open();
    this.open.set(next);
    if (next && this.items().length === 0) this.loadFirstPage();
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.search$.next(value);
  }

  protected onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      this.loadNextPage();
    }
  }

  protected select(tz: SimpleTimeZone): void {
    this.value.set(tz.timezoneName ?? tz.name ?? '');
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }

  private loadFirstPage(): void {
    this.pageIndex.set(1);
    this.fetch(1, true);
  }

  private loadNextPage(): void {
    if (!this.hasNextPage() || this.loading()) return;
    const next = this.pageIndex() + 1;
    this.pageIndex.set(next);
    this.fetch(next, false);
  }

  private fetch(pageNumber: number, replace: boolean): void {
    this.loading.set(true);
    this.error.set(false);
    this.api
      .getTimeZones({
        searchString: this.query().trim() || undefined,
        pageNumber,
        pageSize: PAGE_SIZE,
        sortOrder: 'asc'
      })
      .subscribe({
        next: page => {
          const incoming = page.items ?? [];
          this.items.set(replace ? incoming : [...this.items(), ...incoming]);
          this.hasNextPage.set(page.hasNextPage);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        }
      });
  }
}
