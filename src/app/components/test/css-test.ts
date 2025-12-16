import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-css-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-red-500 text-white">
      <h1 class="text-2xl font-bold">CSS Test</h1>
      <p class="mt-4">Si ves esto en rojo, Tailwind funciona</p>
    </div>
    
    <div class="p-8 bg-primary text-primary-contrast">
      <h2 class="text-xl font-semibold">PrimeNG Colors Test</h2>
      <p class="mt-2 text-muted-color">Si ves colores del theme, PrimeNG funciona</p>
    </div>
    
    <div class="flex flex-col gap-4 p-8">
      <div class="bg-surface-0 p-4 border border-surface-300 rounded-lg">
        <p class="text-surface-900">Surface colors test</p>
      </div>
      <div class="bg-surface-100 p-4 rounded-lg">
        <p class="text-surface-700">More surface colors</p>
      </div>
    </div>
  `,
  styles: [`
    /* Force styles for testing */
    .test-red {
      background-color: red !important;
      color: white !important;
      padding: 16px !important;
    }
  `]
})
export class CssTestComponent {

}