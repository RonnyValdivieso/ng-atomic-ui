import { Component, ElementRef, effect, input, model, output, viewChildren } from '@angular/core';

/**
 * Reusable N-digit one-time-code input: a row of single-digit boxes with
 * auto-advance, backspace-to-previous, arrow navigation and paste-to-fill.
 * Two-way binds the assembled code via `value`; emits `completed` once all
 * digits are entered. Zoneless/signal friendly.
 */
@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [],
  templateUrl: './otp-input.html',
  styleUrls: ['./otp-input.css']
})
export class OtpInputComponent {
  readonly length = input<number>(6);
  readonly value = model<string>('');
  readonly invalid = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly completed = output<string>();

  private readonly cellRefs = viewChildren<ElementRef<HTMLInputElement>>('cell');

  protected readonly cells = () => Array.from({ length: this.length() }, (_, i) => i);

  constructor() {
    // Keep DOM boxes in sync whenever `value` is changed from outside (e.g. reset).
    effect(() => {
      const chars = this.value().split('');
      this.cellRefs().forEach((ref, i) => {
        const next = chars[i] ?? '';
        if (ref.nativeElement.value !== next) ref.nativeElement.value = next;
      });
    });
  }

  protected digit(i: number): string {
    return this.value()[i] ?? '';
  }

  protected onInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement;
    const chars = el.value.replace(/\D/g, '').split('');
    const max = this.length();
    const next = this.value().padEnd(max, ' ').slice(0, max).split('');

    if (chars.length === 0) {
      next[index] = ' ';
      this.commit(next);
      el.value = '';
      return;
    }

    let cursor = index;
    for (const c of chars) {
      if (cursor >= max) break;
      next[cursor] = c;
      cursor++;
    }
    this.commit(next);
    this.focusCell(Math.min(cursor, max - 1));
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    const max = this.length();
    if (event.key === 'Backspace') {
      const current = this.value()[index];
      if (!current && index > 0) {
        event.preventDefault();
        this.setDigit(index - 1, '');
        this.focusCell(index - 1);
      } else if (current) {
        this.setDigit(index, '');
      }
      return;
    }
    if (event.key === 'ArrowLeft' && index > 0) this.focusCell(index - 1);
    if (event.key === 'ArrowRight' && index < max - 1) this.focusCell(index + 1);
  }

  protected onPaste(event: ClipboardEvent): void {
    const max = this.length();
    const text = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, max);
    if (!text) return;
    event.preventDefault();
    const next = Array(max).fill(' ');
    text.split('').forEach((c, i) => (next[i] = c));
    this.commit(next);
    this.focusCell(Math.min(text.length, max - 1));
  }

  private setDigit(index: number, char: string): void {
    const max = this.length();
    const next = this.value().padEnd(max, ' ').slice(0, max).split('');
    next[index] = char || ' ';
    this.commit(next);
  }

  private commit(chars: string[]): void {
    const assembled = chars.join('').replace(/ /g, '');
    this.value.set(assembled);
    // Reflect the cleaned value back into the boxes.
    this.cellRefs().forEach((ref, i) => (ref.nativeElement.value = assembled[i] ?? ''));
    if (assembled.length === this.length()) this.completed.emit(assembled);
  }

  private focusCell(index: number): void {
    this.cellRefs()[index]?.nativeElement.focus();
  }
}
