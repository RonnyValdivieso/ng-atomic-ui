import { Component, computed, input, output, signal, effect, inject, DestroyRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

// Import our atoms
import { ButtonComponent } from '@atoms/button';
import { IconComponent } from '@atoms/icon';
import { InputComponent } from '@atoms/input';

export type SearchBoxSize = 'small' | 'medium' | 'large';
export type SearchBoxVariant = 'default' | 'compact';

/**
 * Advanced search box component that combines input and button atoms
 * Features debounced search, clear functionality, and loading states
 * @example
 * <app-search-box
 *   placeholder="Search products..."
 *   size="medium"
 *   [debounceTime]="300"
 *   [loading]="isSearching"
 *   (searchChanged)="handleSearch($event)"
 *   (searchCleared)="handleClear()">
 * </app-search-box>
 */
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, IconComponent, InputComponent],
  templateUrl: './search-box.html',
  styleUrls: ['./search-box.css']
})
export class SearchBoxComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('searchInput', { static: true }) 
  searchInputRef!: InputComponent;

  // ✅ readonly inputs using signals
  readonly placeholder = input<string>('Search...');
  readonly size = input<SearchBoxSize>('medium');
  readonly variant = input<SearchBoxVariant>('default');
  readonly debounceTime = input<number>(300);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly showSearchButton = input<boolean>(false);

  // ✅ readonly outputs
  readonly searchChanged = output<string>();
  readonly searchCleared = output<void>();
  readonly searchSubmitted = output<string>();

  // ✅ Internal state signals
  private readonly _focused = signal<boolean>(false);

  // ✅ Form control for search input (public for testing)
  readonly searchControl = new FormControl('');

  // ✅ Signal that tracks the current search value reactively
  private readonly _searchValue = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: '' }
  );

  // ✅ Computed properties for template
  protected readonly searchId = computed(() => 
    `search-box-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly containerClasses = computed(() => [
    'search-box',
    `search-box--${this.size()}`,
    `search-box--${this.variant()}`,
    this._focused() ? 'search-box--focused' : '',
    this.disabled() ? 'search-box--disabled' : '',
    this.loading() ? 'search-box--loading' : '',
    this.hasSearchTerm() ? 'search-box--has-value' : ''
  ].filter(Boolean).join(' '));

  protected readonly hasSearchTerm = computed(() => 
    (this._searchValue() || '').trim().length > 0
  );

  protected readonly showClearButton = computed(() =>
    this.clearable() && this.hasSearchTerm() && !this.loading()
  );

  protected readonly inputPlaceholder = computed(() => {
    if (this.loading()) {
      return 'Searching...';
    }
    return this.placeholder();
  });

  constructor() {
    // ✅ Setup debounced search on form control changes
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm: string | null) => {
        this.searchChanged.emit((searchTerm || '').trim());
      });

    // ✅ Sync disabled state with form control
    effect(() => {
      if (this.disabled()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });
  }

  // ✅ Protected event handlers
  protected handleInputFocus(): void {
    this._focused.set(true);
  }

  protected handleInputBlur(): void {
    this._focused.set(false);
  }

  protected handleInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSearchSubmit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.handleClear();
    }
  }

  protected handleSearchSubmit(): void {
    const term = (this.searchControl.value || '').trim();
    if (term && !this.disabled() && !this.loading()) {
      this.searchSubmitted.emit(term);
    }
  }

  protected handleClear(): void {
    this.searchControl.setValue('');
    this.searchCleared.emit();
  }

  protected handleSearchButtonClick(): void {
    this.handleSearchSubmit();
  }

  // ✅ Public API methods
  public focus(): void {
    // Focus will be handled through InputComponent's own focus method if available
    // For now, we'll keep it simple since InputComponent manages its own focus
  }

  public clear(): void {
    this.handleClear();
  }

  public setValue(value: string): void {
    this.searchControl.setValue(value);
  }

  ngAfterViewInit(): void {
    // Setup disabled state synchronization
    if (this.disabled()) {
      this.searchControl.disable();
    }
  }
}