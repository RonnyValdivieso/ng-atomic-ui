import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export type SpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.css']
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('medium');
  readonly strokeWidth = input<string>('4');
  readonly fill = input<string>('transparent');
  readonly animationDuration = input<string>('2s');
  readonly ariaLabel = input<string>('Loading');
  readonly styleClass = input<string>('');

  protected readonly dimensions = computed(() => {
    switch (this.size()) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '80px';
      default: return '40px';
    }
  });
}
