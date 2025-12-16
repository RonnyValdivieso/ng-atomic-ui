import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@atoms/icon';
import { InputComponent } from '@atoms/input';

/**
 * Guide section showcasing the Icon component and PrimeIcons catalog
 * Includes search functionality and size demonstrations
 */
@Component({
  selector: 'app-icon-guide',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, InputComponent],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Hero Section -->
      <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h1 class="text-5xl font-bold text-balance">Icon Component</h1>
          <p class="text-xl text-muted-color text-pretty">
            Componente para mostrar iconos usando PrimeIcons. Incluye múltiples tamaños, 
            colores personalizables y una extensa librería de iconos disponibles.
          </p>
        </div>
      </section>

      <!-- API Overview -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Características Principales</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200">
            <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Librería</h3>
            <p class="text-sm text-muted-color">PrimeIcons (300+ iconos)</p>
          </div>

          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200">
            <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">5 Tamaños</h3>
            <p class="text-sm text-muted-color">xs, sm, base, lg, xl</p>
          </div>

          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200">
            <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Estados</h3>
            <p class="text-sm text-muted-color">enabled, disabled, colores custom</p>
          </div>

          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200">
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Uso</h3>
            <p class="text-sm text-muted-color">Standalone o integrado en componentes</p>
          </div>
        </div>
      </section>

      <!-- Tamaños Demo -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Tamaños Disponibles</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-star" size="xs"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">size="xs"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-star" size="sm"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">size="sm"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-star" size="base"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">size="base"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-star" size="lg"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">size="lg"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-star" size="xl"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">size="xl"</code>
          </div>
        </div>
      </section>

      <!-- Estados Demo -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Estados del Icono</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-check" color="success" size="lg"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">color="success"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-times" color="danger" size="lg"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">color="danger"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-info-circle" color="info" size="lg"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">color="info"</code>
          </div>
          <div class="flex flex-col gap-3 items-center">
            <app-icon name="pi-exclamation-triangle" color="warning" size="lg"></app-icon>
            <code class="text-xs bg-surface-100 px-2 py-1 rounded">color="warning"</code>
          </div>
        </div>
      </section>

      <!-- Buscador de Iconos -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Catálogo de Iconos PrimeIcons</h2>
        
        <div class="max-w-md">
          <app-input
            [formControl]="searchControl"
            placeholder="Buscar iconos... (ej: home, user, settings)"
            type="text">
          </app-input>
        </div>
        
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div 
            *ngFor="let icon of filteredIcons" 
            class="flex flex-col gap-2 items-center p-4 bg-surface-0 rounded-lg border border-surface-200 hover:border-primary cursor-pointer transition-colors"
            (click)="copyIconName(icon)">
            <app-icon [name]="icon" size="lg"></app-icon>
            <span class="text-xs text-center text-muted-color truncate w-full">{{ icon.replace('pi-', '') }}</span>
          </div>
        </div>
        
        <div *ngIf="filteredIcons.length === 0" class="flex flex-col items-center gap-4 py-12">
          <app-icon name="pi-search" size="xl" color="muted"></app-icon>
          <p class="text-muted-color">No se encontraron iconos que coincidan con "{{ searchControl.value }}"</p>
        </div>
      </section>

      <!-- Casos de Uso -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Casos de Uso Comunes</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="flex flex-col gap-4 bg-surface-0 rounded-lg p-6 border border-surface-200">
            <h3 class="text-lg font-semibold">Navegación</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <app-icon name="pi-home" size="base"></app-icon>
                <span class="text-sm">Inicio</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-user" size="base"></app-icon>
                <span class="text-sm">Perfil</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-cog" size="base"></app-icon>
                <span class="text-sm">Configuración</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-sign-out" size="base"></app-icon>
                <span class="text-sm">Salir</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col gap-4 bg-surface-0 rounded-lg p-6 border border-surface-200">
            <h3 class="text-lg font-semibold">Acciones</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <app-icon name="pi-plus" size="base" color="success"></app-icon>
                <span class="text-sm">Crear</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-pencil" size="base" color="primary"></app-icon>
                <span class="text-sm">Editar</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-trash" size="base" color="danger"></app-icon>
                <span class="text-sm">Eliminar</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-download" size="base" color="info"></app-icon>
                <span class="text-sm">Descargar</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col gap-4 bg-surface-0 rounded-lg p-6 border border-surface-200">
            <h3 class="text-lg font-semibold">Estados</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <app-icon name="pi-check-circle" size="base" color="success"></app-icon>
                <span class="text-sm">Éxito</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-times-circle" size="base" color="danger"></app-icon>
                <span class="text-sm">Error</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-exclamation-triangle" size="base" color="warning"></app-icon>
                <span class="text-sm">Advertencia</span>
              </div>
              <div class="flex items-center gap-3">
                <app-icon name="pi-info-circle" size="base" color="info"></app-icon>
                <span class="text-sm">Información</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Código de Ejemplo -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Ejemplos de Código</h2>
        <pre class="bg-surface-900 text-surface-50 rounded-lg p-6 overflow-x-auto text-sm"><code>&lt;!-- Icono básico --&gt;
&lt;app-icon name="pi-home"&gt;&lt;/app-icon&gt;

&lt;!-- Icono con tamaño personalizado --&gt;
&lt;app-icon name="pi-star" size="lg"&gt;&lt;/app-icon&gt;

&lt;!-- Icono con color personalizado --&gt;
&lt;app-icon 
  name="pi-heart" 
  size="xl" 
  color="#ef4444"&gt;
&lt;/app-icon&gt;</code></pre>
      </section>
    </div>
  `,
  styleUrls: ['./icon-guide.css']
})
export class IconGuideComponent {
  searchControl = new FormControl('');

  // Lista completa de iconos PrimeIcons más comunes
  allIcons = [
    'pi-home', 'pi-user', 'pi-cog', 'pi-search', 'pi-plus', 'pi-minus', 'pi-times', 'pi-check',
    'pi-heart', 'pi-star', 'pi-bookmark', 'pi-tag', 'pi-tags', 'pi-calendar', 'pi-clock',
    'pi-bell', 'pi-envelope', 'pi-phone', 'pi-map-marker', 'pi-globe', 'pi-wifi', 'pi-download',
    'pi-upload', 'pi-cloud', 'pi-folder', 'pi-file', 'pi-image', 'pi-video', 'pi-music',
    'pi-camera', 'pi-microphone', 'pi-volume-up', 'pi-volume-down', 'pi-volume-off',
    'pi-play', 'pi-pause', 'pi-stop', 'pi-fast-forward', 'pi-backward', 'pi-skip-forward',
    'pi-skip-backward', 'pi-replay', 'pi-refresh', 'pi-sync', 'pi-lock', 'pi-unlock',
    'pi-key', 'pi-shield', 'pi-eye', 'pi-eye-slash', 'pi-thumbs-up', 'pi-thumbs-down',
    'pi-share-alt', 'pi-external-link', 'pi-link', 'pi-copy', 'pi-save', 'pi-print',
    'pi-trash', 'pi-pencil', 'pi-edit', 'pi-eraser', 'pi-sort', 'pi-filter', 'pi-sliders-h',
    'pi-th', 'pi-th-large', 'pi-list', 'pi-bars', 'pi-grip-horizontal', 'pi-grip-vertical',
    'pi-arrow-up', 'pi-arrow-down', 'pi-arrow-left', 'pi-arrow-right', 'pi-arrow-circle-up',
    'pi-arrow-circle-down', 'pi-arrow-circle-left', 'pi-arrow-circle-right', 'pi-chevron-up',
    'pi-chevron-down', 'pi-chevron-left', 'pi-chevron-right', 'pi-angle-up', 'pi-angle-down',
    'pi-angle-left', 'pi-angle-right', 'pi-caret-up', 'pi-caret-down', 'pi-caret-left',
    'pi-caret-right', 'pi-sort-up', 'pi-sort-down', 'pi-expand', 'pi-compress',
    'pi-info', 'pi-info-circle', 'pi-question', 'pi-question-circle', 'pi-exclamation',
    'pi-exclamation-circle', 'pi-exclamation-triangle', 'pi-check-circle', 'pi-times-circle',
    'pi-ban', 'pi-flag', 'pi-comment', 'pi-comments', 'pi-graduation-cap', 'pi-building',
    'pi-briefcase', 'pi-shopping-cart', 'pi-credit-card', 'pi-money-bill', 'pi-gift',
    'pi-truck', 'pi-plane', 'pi-car', 'pi-bicycle', 'pi-taxi', 'pi-bus', 'pi-train',
    'pi-ship', 'pi-anchor', 'pi-compass', 'pi-map', 'pi-location-arrow', 'pi-crosshairs',
    'pi-sun', 'pi-moon', 'pi-cloud-rain', 'pi-snowflake', 'pi-bolt', 'pi-fire',
    'pi-droplet', 'pi-leaf', 'pi-tree', 'pi-seedling', 'pi-apple-alt', 'pi-carrot'
  ];

  get filteredIcons() {
    const search = this.searchControl.value?.toLowerCase() || '';
    if (!search) return this.allIcons.slice(0, 48); // Mostrar primeros 48 por defecto
    
    return this.allIcons.filter(icon => 
      icon.toLowerCase().includes(search) || 
      icon.replace('pi-', '').toLowerCase().includes(search)
    );
  }

  copyIconName(iconName: string): void {
    navigator.clipboard.writeText(iconName).then(() => {
      console.log(`Icono copiado: ${iconName}`);
      // En una aplicación real, mostrarías un toast
      alert(`Icono "${iconName}" copiado al portapapeles`);
    });
  }
}