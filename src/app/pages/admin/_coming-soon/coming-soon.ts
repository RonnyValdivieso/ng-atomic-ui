import { Component, input } from '@angular/core';

/**
 * Placeholder page used by AAA admin nav items that don't yet have a real
 * implementation. Wired into routes today so the sidebar is fully navigable;
 * each is replaced by its real list/details/form trio in a follow-up plan.
 */
@Component({
  selector: 'app-admin-coming-soon',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-surface-900">{{ title() }}</h1>
        <p class="text-muted-color text-sm mt-1">{{ subtitle() }}</p>
      </div>
      <div class="flex flex-col items-center justify-center py-24 text-muted-color border border-dashed border-surface-300 rounded-lg">
        <i class="pi pi-clock text-5xl mb-4"></i>
        <h2 class="text-lg font-semibold mb-1">Coming soon</h2>
        <p class="text-sm">This screen will be implemented in a follow-up iteration.</p>
      </div>
    </div>
  `
})
export class ComingSoonComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
