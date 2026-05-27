import { Component, input, model, output } from '@angular/core';

import { ButtonComponent, ButtonVariant } from '@atoms/button';
import { ModalComponent } from '@organisms/modal';

/**
 * Small wrapper around ModalComponent for yes/no confirmations.
 * Drop-in replacement for `window.confirm()` with the project's
 * design-system styling.
 *
 * @example
 * <app-confirm-dialog
 *   [(visible)]="confirmVisible"
 *   title="Eliminar"
 *   message="¿Eliminar este registro?"
 *   confirmLabel="Eliminar"
 *   confirmVariant="danger"
 *   [loading]="deleting()"
 *   (confirmed)="doDelete()">
 * </app-confirm-dialog>
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      [header]="title()"
      [closable]="!loading()"
      [style]="{ width: '420px' }">

      <p class="py-4 text-base text-surface-800">{{ message() }}</p>

      <div footer class="flex justify-end gap-2">
        <app-button
          [label]="cancelLabel()"
          variant="secondary"
          [disabled]="loading()"
          (clicked)="cancel()">
        </app-button>
        <app-button
          [label]="confirmLabel()"
          [variant]="confirmVariant()"
          [loading]="loading()"
          (clicked)="confirm()">
        </app-button>
      </div>
    </app-modal>
  `
})
export class ConfirmDialogComponent {
  readonly visible = model<boolean>(false);
  readonly title = input<string>('Confirmar');
  readonly message = input<string>('¿Continuar con la acción?');
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly confirmVariant = input<ButtonVariant>('danger');
  readonly loading = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected onVisibleChange(value: boolean): void {
    this.visible.set(value);
    if (!value) this.cancelled.emit();
  }

  protected confirm(): void {
    this.confirmed.emit();
  }

  protected cancel(): void {
    this.visible.set(false);
    this.cancelled.emit();
  }
}
