import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@organisms/header';
import { SidebarComponent, type NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-surface-50">
      <!-- Header -->
      <app-header (menuClicked)="toggleSidebar()"></app-header>
      
      <!-- Sidebar -->
      <app-sidebar 
        [isOpen]="sidebarOpen()" 
        [navigationItems]="navigationItems()"
        (itemClicked)="onSidebarItemClick($event)">
      </app-sidebar>
      
      <!-- Main Content Area -->
      <main class="pt-16 transition-all duration-300"
            [class.lg:pl-64]="sidebarOpen()"
            [class.lg:pl-0]="!sidebarOpen()">
        <div class="mx-auto p-6 lg:py-8 px-16">
          <!-- Main content slot -->
          <ng-content></ng-content>
        </div>
      </main>

      <!-- Mobile sidebar overlay -->
      <div 
        class="fixed inset-0 bg-surface-900/50 z-10 lg:hidden"
        [class.block]="sidebarOpen()"
        [class.hidden]="!sidebarOpen()"
        (click)="closeSidebar()">
      </div>
    </div>
  `,
  styles: [`
    /* Content area transitions */
    main {
      transition: padding-left 0.3s ease-in-out;
    }

    /* Desktop: padding when sidebar is open */
    @media (min-width: 1024px) {
      main.lg\\:pl-64 {
        padding-left: 16rem;
      }
      
      main.lg\\:pl-0 {
        padding-left: 0;
      }
    }

    /* Mobile: no padding */
    @media (max-width: 1023px) {
      main {
        padding-left: 0 !important;
      }
    }
  `]
})
export class MainLayoutComponent {
  // Inputs
  readonly navigationItems = input<NavigationItem[]>([]);
  
  // Signals
  protected readonly sidebarOpen = signal(typeof window !== 'undefined' && window.innerWidth >= 1024);
  protected isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  constructor() {
    // Listen for window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isDesktop = window.innerWidth >= 1024;
        // Auto-close sidebar on mobile
        if (!this.isDesktop) {
          this.sidebarOpen.set(false);
        }
      });
    }
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected onSidebarItemClick(item: NavigationItem): void {
    // Close sidebar on mobile when item is clicked
    if (!this.isDesktop) {
      this.closeSidebar();
    }
  }
}