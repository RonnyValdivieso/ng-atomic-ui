import { Component, input, signal } from '@angular/core';

/**
 * Compact icon button that copies an id to the clipboard, flipping to a green
 * check for ~1.2s as confirmation. Used inside table/card row actions in place
 * of showing the raw id as text.
 */
@Component({
  selector: 'app-copy-id-button',
  standalone: true,
  templateUrl: './copy-id-button.html',
  styleUrls: ['./copy-id-button.css']
})
export class CopyIdButtonComponent {
  readonly value = input<string>('');
  readonly label = input<string>('Copy ID');

  protected readonly copied = signal(false);

  protected copy(event: MouseEvent): void {
    event.stopPropagation();
    const value = this.value();
    if (value && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }
}
