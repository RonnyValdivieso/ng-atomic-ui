import { Component, input, signal } from '@angular/core';

import { HeaderComponent } from '@organisms/header';
import { SidebarComponent, type NavigationItem } from '@organisms/sidebar';

const COLLAPSE_KEY = 'bb_nav_collapsed';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent],
  template: `
    <div class="app" [class.nav-collapsed]="collapsed()">
      <app-sidebar
        [navigationItems]="navigationItems()"
        [collapsed]="collapsed()"
        (toggleCollapse)="toggleCollapse()">
      </app-sidebar>

      <app-header></app-header>

      <main class="main">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  readonly navigationItems = input<NavigationItem[]>([]);

  protected readonly collapsed = signal(this.readCollapsed());

  protected toggleCollapse(): void {
    this.collapsed.update(value => {
      const next = !value;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* storage unavailable — collapse stays in-memory only */
      }
      return next;
    });
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
