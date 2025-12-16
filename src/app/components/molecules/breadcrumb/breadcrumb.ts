import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

/**
 * Reusable Breadcrumb component based on PrimeNG Breadcrumb
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.css']
})
export class BreadcrumbComponent {
  // Inputs
  readonly items = input<MenuItem[]>([]);
  readonly home = input<MenuItem | undefined>(undefined);
  readonly styleClass = input<string>('');

  // Outputs
  readonly onItemClick = output<MenuItem>();

  // Event Handlers
  protected onItemClickHandler(event: any): void {
    if (event.item) {
      this.onItemClick.emit(event.item);
    }
  }
}
