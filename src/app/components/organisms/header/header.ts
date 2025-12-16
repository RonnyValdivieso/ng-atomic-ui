import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ThemeToggleComponent } from '@atoms/theme-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ThemeToggleComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 h-16 bg-surface-0 border-b border-surface-200 z-30 shadow-sm">
      <div class="h-full px-6 flex items-center justify-between gap-4">
        <!-- Left Section: Menu & Logo -->
        <div class="flex items-center gap-4">
          <p-button 
            [text]="true" 
            size="small"
            icon="pi pi-bars"
            (onClick)="onMenuClick()"
            styleClass="lg:flex p-2! w-10! h-10!">
          </p-button>
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span class="text-primary-contrast font-bold text-sm">A</span>
            </div>
            <span class="font-semibold text-lg hidden sm:inline text-color">Atomic DS</span>
          </div>
        </div>

        <!-- Center Section: Search (hidden on mobile) -->
        <div class="flex-1 max-w-md hidden md:flex">
          <div class="relative w-full">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-color"></i>
            <input 
              pInputText 
              placeholder="Search documentation..." 
              class="pl-10! w-full"
            />
          </div>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex items-center gap-2">
          <!-- Theme Toggle Button -->
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Ensure header stays at top */
    :host {
      display: block;
    }

    /* Icon sizing */
    .pi.pi-search {
      font-size: 1rem;
      color: var(--p-text-muted-color);
    }
  `]
})
export class HeaderComponent {
  // Output events
  readonly menuClicked = output<void>();

  protected onMenuClick(): void {
    this.menuClicked.emit();
  }
}