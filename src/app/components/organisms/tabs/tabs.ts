import { Component, input, output, TemplateRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

export interface TabItem {
  title: string;
  content: TemplateRef<any> | string;
  value: any;
  disabled?: boolean;
}

/**
 * Reusable Tabs component based on PrimeNG Tabs
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule, NgClass],
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.css']
})
export class TabsComponent {
  // Inputs
  readonly tabs = input<TabItem[]>([]);
  readonly value = input<any>(undefined);
  readonly scrollable = input<boolean>(false);
  readonly styleClass = input<string>('');

  // Outputs
  readonly valueChange = output<any>();

  // Helper to check if content is a TemplateRef
  isTemplate(content: any): boolean {
    return content instanceof TemplateRef;
  }

  // Event Handlers
  protected onValueChange(value: any): void {
    this.valueChange.emit(value);
  }
}
