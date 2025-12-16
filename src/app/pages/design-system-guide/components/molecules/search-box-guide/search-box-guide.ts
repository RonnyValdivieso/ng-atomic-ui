import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Import the component we're documenting
import { SearchBoxComponent } from '@molecules/search-box';

/**
 * Guide component for SearchBox molecule
 * Demonstrates the SearchBox component following Atomic Design principles
 * Showcases composition of Input atom with search functionality
 */
@Component({
  selector: 'app-search-box-guide',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchBoxComponent
  ],
  templateUrl: './search-box-guide.html',
  styleUrls: ['./search-box-guide.css']
})
export class SearchBoxGuideComponent {
  // Interactive demo state
  protected readonly searchTerm = signal<string>('');
  protected readonly lastAction = signal<string>('');
  protected readonly isLoading = signal<boolean>(false);

  // Event handlers for interactive demo
  protected handleSearch(term: string): void {
    this.searchTerm.set(term);
    this.lastAction.set(`Search changed: "${term}"`);
  }

  protected handleClear(): void {
    this.searchTerm.set('');
    this.lastAction.set('Search cleared');
  }

  protected handleSubmit(term: string): void {
    this.lastAction.set(`Search submitted: "${term}"`);
  }

  protected handleSearchWithLoading(term: string): void {
    this.searchTerm.set(term);
    if (term.trim()) {
      this.isLoading.set(true);
      // Simulate async search
      setTimeout(() => {
        this.isLoading.set(false);
        this.lastAction.set(`Search completed: "${term}"`);
      }, 2000);
    } else {
      this.isLoading.set(false);
      this.lastAction.set('Search cleared');
    }
  }

  protected toggleLoading(): void {
    this.isLoading.set(!this.isLoading());
  }

  // API documentation data
  protected readonly inputs = [
    { name: 'placeholder', type: 'string', default: '"Search..."', description: 'Placeholder text for the search input' },
    { name: 'size', type: 'SearchBoxSize', default: '"medium"', description: 'Size variant: small, medium, or large' },
    { name: 'variant', type: 'SearchBoxVariant', default: '"default"', description: 'Visual variant: default or compact' },
    { name: 'debounceTime', type: 'number', default: '300', description: 'Debounce time in milliseconds for search input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the search box is disabled' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Whether to show loading state' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Whether to show clear button when there is text' },
    { name: 'showSearchButton', type: 'boolean', default: 'false', description: 'Whether to show dedicated search button' }
  ] as const;

  protected readonly outputs = [
    { name: 'searchChanged', type: 'string', description: 'Emitted when search term changes (debounced)' },
    { name: 'searchCleared', type: 'void', description: 'Emitted when search is cleared' },
    { name: 'searchSubmitted', type: 'string', description: 'Emitted when search is submitted via Enter or button click' }
  ] as const;

  protected readonly methods = [
    { name: 'focus()', params: 'void', description: 'Focus the search input' },
    { name: 'clear()', params: 'void', description: 'Clear the search input programmatically' },
    { name: 'setValue(value)', params: 'string', description: 'Set the search input value programmatically' }
  ] as const;

  // Code example
  protected readonly codeExample = `<!-- Basic Usage -->
<app-search-box
  placeholder="Search products..."
  (searchChanged)="handleSearch($event)"
  (searchCleared)="handleClear()"
  (searchSubmitted)="handleSubmit($event)">
</app-search-box>

<!-- With Search Button and Loading -->
<app-search-box
  placeholder="Advanced search..."
  size="large"
  [showSearchButton]="true"
  [loading]="isSearching"
  [debounceTime]="500"
  (searchChanged)="onSearchChanged($event)"
  (searchSubmitted)="onSearchSubmitted($event)">
</app-search-box>

<!-- Compact Variant -->
<app-search-box
  variant="compact"
  size="small"
  placeholder="Quick search..."
  [clearable]="false"
  (searchChanged)="onQuickSearch($event)">
</app-search-box>`;
}