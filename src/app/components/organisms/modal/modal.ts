import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

/**
 * Reusable Modal component based on PrimeNG Dialog
 * @example
 * <app-modal
 *   [(visible)]="isVisible"
 *   header="My Modal"
 *   [style]="{ width: '50vw' }">
 *   <p>Modal Content</p>
 *   <ng-template footer>
 *     <button (click)="isVisible.set(false)">Close</button>
 *   </ng-template>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent {
  // Visibility (Two-way binding)
  readonly visible = model<boolean>(false);

  // Configuration
  readonly header = input<string>('');
  readonly style = input<object>({ width: '50vw' });
  readonly styleClass = input<string>('');
  readonly modal = input<boolean>(true);
  readonly closable = input<boolean>(true);
  readonly draggable = input<boolean>(false);
  readonly resizable = input<boolean>(false);
  readonly position = input<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');
  readonly appendTo = input<any>('body');

  // Events
  readonly onShow = output<void>();
  readonly onHide = output<void>();

  protected onShowHandler(): void {
    this.onShow.emit();
  }

  protected onHideHandler(): void {
    this.onHide.emit();
  }
}
