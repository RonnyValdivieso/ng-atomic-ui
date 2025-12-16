import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      class="fixed left-0 top-16 bottom-0 w-64 bg-surface-0 border-r border-surface-200 z-20 transition-all duration-300"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()">
      
      <nav class="h-full overflow-y-auto p-4">
        <ul class="space-y-1">
          @for (item of navigationItems(); track item.label) {
            <li>
              <!-- Navigation item with route -->
              @if (item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-primary text-primary-contrast"
                  [routerLinkActiveOptions]="{exact: false}"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg text-color hover:bg-surface-100 transition-colors cursor-pointer group"
                  (click)="onItemClick(item)">
                  <i [class]="'pi ' + item.icon + ' text-lg'"></i>
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="px-2 py-1 text-xs font-semibold bg-primary text-primary-contrast rounded-full">
                      {{ item.badge }}
                    </span>
                  }
                </a>
              }
              
              <!-- Navigation item without route (section header) -->
              @if (!item.route && !item.children) {
                <div class="flex items-center gap-3 px-4 py-3 rounded-lg text-color hover:bg-surface-100 transition-colors cursor-pointer"
                     (click)="onItemClick(item)">
                  <i [class]="'pi ' + item.icon + ' text-lg'"></i>
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="px-2 py-1 text-xs font-semibold bg-primary text-primary-contrast rounded-full">
                      {{ item.badge }}
                    </span>
                  }
                </div>
              }
              
              <!-- Navigation item with children -->
              @if (item.children && item.children.length > 0) {
                <div class="space-y-1">
                  <div class="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-muted-color uppercase">
                    <i [class]="'pi ' + item.icon + ' text-base'"></i>
                    <span>{{ item.label }}</span>
                  </div>
                  <ul class="ml-4 space-y-1">
                    @for (child of item.children; track child.label) {
                      <li>
                        <a
                          [routerLink]="child.route"
                          routerLinkActive="bg-primary text-primary-contrast"
                          [routerLinkActiveOptions]="{exact: false}"
                          class="flex items-center gap-3 px-4 py-2 rounded-lg text-color hover:bg-surface-100 transition-colors cursor-pointer text-sm"
                          (click)="onItemClick(child)">
                          <i [class]="'pi ' + child.icon"></i>
                          <span class="flex-1">{{ child.label }}</span>
                          @if (child.badge) {
                            <span class="px-2 py-1 text-xs font-semibold bg-primary text-primary-contrast rounded-full">
                              {{ child.badge }}
                            </span>
                          }
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    /* Smooth transitions for sidebar - synchronized with main content */
    aside {
      transition: transform 0.3s ease-in-out;
    }

    /* Scrollbar styling */
    nav::-webkit-scrollbar {
      width: 6px;
    }

    nav::-webkit-scrollbar-track {
      background: transparent;
    }

    nav::-webkit-scrollbar-thumb {
      background: var(--p-surface-300);
      border-radius: 3px;
    }

    nav::-webkit-scrollbar-thumb:hover {
      background: var(--p-surface-400);
    }

    /* Mobile: sidebar slides from left */
    @media (max-width: 1023px) {
      aside {
        transform: translateX(-100%);
      }
      
      aside.translate-x-0 {
        transform: translateX(0);
      }
    }

    /* Desktop: sidebar slides to left when closed */
    @media (min-width: 1024px) {
      aside {
        transition: transform 0.3s ease-in-out;
      }

      aside.translate-x-0 {
        transform: translateX(0);
      }

      aside.-translate-x-full {
        transform: translateX(-100%);
      }
    }

    /* Active link styles */
    a.bg-primary {
      background-color: var(--p-primary-color);
      color: var(--p-primary-contrast-color);
    }

    a.bg-primary i {
      color: var(--p-primary-contrast-color);
    }
  `]
})
export class SidebarComponent {
  // Inputs
  readonly isOpen = input<boolean>(false);
  readonly navigationItems = input<NavigationItem[]>([]);

  // Outputs
  readonly itemClicked = output<NavigationItem>();

  protected onItemClick(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }
}
