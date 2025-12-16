import { Component, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';

export type TieredMenuSize = 'small' | 'medium' | 'large';
export type TieredMenuVariant = 'default' | 'outlined';

/**
 * TieredMenu component powered by PrimeNG TieredMenu
 * Provides a multi-level dropdown menu with nested navigation
 * @example
 * <app-tiered-menu
 *   [model]="menuItems"
 *   [popup]="true"
 *   size="medium"
 *   variant="default"
 *   (itemClick)="handleMenuClick($event)">
 * </app-tiered-menu>
 */
@Component({
  selector: 'app-tiered-menu',
  standalone: true,
  imports: [CommonModule, TieredMenuModule],
  templateUrl: './tiered-menu.html',
  styleUrls: ['./tiered-menu.css']
})
export class TieredMenuComponent {
  @ViewChild('menu') menu!: TieredMenu;

  // Menu configuration
  readonly model = input<MenuItem[]>([]);
  readonly popup = input<boolean>(true);
  readonly appendTo = input<any>('body');
  readonly autoZIndex = input<boolean>(true);
  readonly baseZIndex = input<number>(0);
  
  // Design system properties
  readonly size = input<TieredMenuSize>('medium');
  readonly variant = input<TieredMenuVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly styleClass = input<string>('');
  
  // Events
  readonly itemClick = output<{ originalEvent: Event; item: MenuItem }>();
  readonly menuShow = output<void>();
  readonly menuHide = output<void>();

  /**
   * Toggle the menu visibility (for popup mode)
   * @param event - The triggering event
   */
  toggle(event: Event): void {
    if (!this.disabled() && this.menu) {
      this.menu.toggle(event);
    }
  }

  /**
   * Show the menu (for popup mode)
   * @param event - The triggering event
   */
  show(event: Event): void {
    if (!this.disabled() && this.menu) {
      this.menu.show(event);
    }
  }

  /**
   * Hide the menu (for popup mode)
   */
  hide(): void {
    if (this.menu) {
      this.menu.hide();
    }
  }

  protected handleItemClick(event: { originalEvent: Event; item: MenuItem }): void {
    this.itemClick.emit(event);
  }

  protected handleShow(): void {
    this.menuShow.emit();
  }

  protected handleHide(): void {
    this.menuHide.emit();
  }
}
