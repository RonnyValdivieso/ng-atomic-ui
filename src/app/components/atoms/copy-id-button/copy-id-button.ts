import { Component, input, signal } from '@angular/core';

/**
 * Button that copies an id to the clipboard, flipping to a green check for
 * ~1.2s as confirmation. Two shapes: the default `compact` icon-only button
 * used inside table/card row actions, and a labelled pill (`[compact]="false"`)
 * used in page headers in place of showing the raw id as text.
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
  /** Icon-only row-action shape when true; labelled pill when false. */
  readonly compact = input<boolean>(true);

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
