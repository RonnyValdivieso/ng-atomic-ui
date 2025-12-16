import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tailwind-test',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule],
  template: `
    <div class="p-8 bg-surface-0 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-primary mb-6">Tailwind + PrimeNG Test</h2>
      
      <!-- Test Tailwind utility classes -->
      <div class="flex flex-col gap-4 mb-6">
        <div class="bg-primary-100 p-4 rounded-lg">
          <p class="text-primary-700">Primary color background with text</p>
        </div>
        <div class="bg-surface-100 p-4 rounded-lg border border-surface-300">
          <p class="text-surface-700">Surface colors working</p>
        </div>
      </div>

      <!-- Test PrimeNG components with Tailwind classes -->
      <div class="flex flex-col sm:flex-row gap-4">
        <input 
          pInputText 
          placeholder="PrimeNG Input with Tailwind" 
          class="flex-1"
        />
        <p-button 
          label="Test Button" 
          icon="pi pi-check"
          class="w-full sm:w-auto"
        ></p-button>
      </div>

      <!-- Test responsive design -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div class="bg-highlight p-4 rounded-lg text-center">
          <p class="text-muted-color">Grid item 1</p>
        </div>
        <div class="bg-highlight p-4 rounded-lg text-center">
          <p class="text-muted-color">Grid item 2</p>
        </div>
        <div class="bg-highlight p-4 rounded-lg text-center">
          <p class="text-muted-color">Grid item 3</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Additional custom styles if needed */
  `]
})
export class TailwindTestComponent {

}