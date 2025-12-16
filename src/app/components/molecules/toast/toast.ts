import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Reusable Toast component based on PrimeNG Toast
 * Acts as a container for global notifications.
 * 
 * @example
 * // In your main layout:
 * <app-toast></app-toast>
 * 
 * // To show a toast:
 * constructor(private messageService: MessageService) {}
 * show() {
 *   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
 * }
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  // Configuration
  readonly position = input<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center'>('top-right');
  readonly key = input<string | undefined>(undefined);
  readonly baseZIndex = input<number>(0);
  readonly autoZIndex = input<boolean>(true);

  // Events
  readonly onClose = output<any>();

  protected onCloseHandler(event: any): void {
    this.onClose.emit(event);
  }
}
