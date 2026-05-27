import { Component, effect, input, signal } from '@angular/core';
import * as QRCode from 'qrcode';

/**
 * Renders arbitrary text (e.g. an `otpauth://` URI) as a QR code, generated
 * entirely client-side — the payload never leaves the browser. Outputs a
 * PNG data URL into an `<img>`.
 */
@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [],
  template: `
    @if (dataUrl(); as src) {
      <img [src]="src" [attr.alt]="alt()" [width]="size()" [height]="size()" />
    }
  `,
  styles: [':host { display: inline-block; line-height: 0; } img { display: block; width: 100%; height: 100%; }']
})
export class QrCodeComponent {
  readonly data = input.required<string>();
  readonly size = input<number>(168);
  readonly alt = input<string>('QR code');

  protected readonly dataUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const text = this.data();
      const width = this.size();
      if (!text) {
        this.dataUrl.set(null);
        return;
      }
      QRCode.toDataURL(text, { width, margin: 0, errorCorrectionLevel: 'M' })
        .then(url => this.dataUrl.set(url))
        .catch(() => this.dataUrl.set(null));
    });
  }
}
