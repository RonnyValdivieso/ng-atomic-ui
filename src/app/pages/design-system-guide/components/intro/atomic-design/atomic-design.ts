import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Introduction section explaining Atomic Design methodology
 * Shows the five levels: Atoms, Molecules, Organisms, Templates, Pages
 */
@Component({
  selector: 'app-atomic-design-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Hero Section -->
      <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h1 class="text-5xl font-bold text-balance">¿Qué es Atomic Design?</h1>
          <p class="text-xl text-muted-color text-pretty">
            Atomic Design es una metodología para crear sistemas de diseño de manera sistemática y escalable.
            Los componentes se organizan en cinco niveles distintos: Atoms, Molecules, Organisms, Templates y Pages.
          </p>
        </div>
      </section>

      <!-- Atomic Levels Section -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Niveles del Sistema</h2>
        
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Atoms Card -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-primary/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Atoms</h3>
            <p class="text-sm text-muted-color">
              Elementos básicos e indivisibles como botones, inputs, labels. 
              Son los bloques de construcción fundamentales del sistema.
            </p>
            <ul class="text-sm text-muted-color list-disc list-inside mt-2">
              <li>Button</li>
              <li>Icon</li>
              <li>Input</li>
              <li>Label</li>
              <li>Avatar</li>
              <li>Badge</li>
            </ul>
          </div>

          <!-- Molecules Card -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-cyan-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Molecules</h3>
            <p class="text-sm text-muted-color">
              Combinaciones simples de atoms que funcionan juntos para formar 
              una unidad funcional específica.
            </p>
            <ul class="text-sm text-muted-color list-disc list-inside mt-2">
              <li>FormField</li>
              <li>SearchBox</li>
              <li>Card</li>
              <li>Dropdown</li>
              <li>Breadcrumb</li>
            </ul>
          </div>

          <!-- Organisms Card -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-green-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Organisms</h3>
            <p class="text-sm text-muted-color">
              Componentes complejos que forman secciones distintas de interfaz, 
              combinando molecules y atoms.
            </p>
            <ul class="text-sm text-muted-color list-disc list-inside mt-2">
              <li>Header</li>
              <li>Navigation</li>
              <li>Sidebar</li>
              <li>Footer</li>
              <li>DataTable</li>
            </ul>
          </div>
        </div>

        <!-- Additional Levels -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Templates Card -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-purple-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Templates</h3>
            <p class="text-sm text-muted-color">
              Layouts de página que definen la estructura sin contenido específico, 
              organizando organisms en layouts coherentes.
            </p>
            <ul class="text-sm text-muted-color list-disc list-inside mt-2">
              <li>PageLayout</li>
              <li>DashboardLayout</li>
              <li>AuthLayout</li>
              <li>AdminLayout</li>
            </ul>
          </div>

          <!-- Pages Card -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-orange-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Pages</h3>
            <p class="text-sm text-muted-color">
              Instancias específicas de templates con contenido real y datos concretos, 
              representando experiencias de usuario completas.
            </p>
            <ul class="text-sm text-muted-color list-disc list-inside mt-2">
              <li>HomePage</li>
              <li>LoginPage</li>
              <li>ProfilePage</li>
              <li>SettingsPage</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Methodology Benefits -->
      <section class="bg-surface-50 rounded-xl p-8 flex flex-col gap-6 border border-surface-200">
        <h2 class="text-3xl font-semibold">Beneficios de esta metodología</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Mantenibilidad -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-blue-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Mantenibilidad</h3>
            <p class="text-sm text-muted-color">Cambios centralizados se propagan automáticamente en toda la aplicación</p>
          </div>

          <!-- Reutilización -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-green-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Reutilización</h3>
            <p class="text-sm text-muted-color">Componentes diseñados para máxima reutilización y composición</p>
          </div>

          <!-- Consistencia -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-purple-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Consistencia</h3>
            <p class="text-sm text-muted-color">Garantiza coherencia visual y funcional en toda la interfaz</p>
          </div>

          <!-- Escalabilidad -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-yellow-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Escalabilidad</h3>
            <p class="text-sm text-muted-color">Facilita el crecimiento del sistema sin perder control</p>
          </div>

          <!-- Colaboración -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-pink-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Colaboración</h3>
            <p class="text-sm text-muted-color">Lenguaje común entre diseño y desarrollo para mejor comunicación</p>
          </div>

          <!-- Testing -->
          <div class="bg-surface-0 rounded-lg p-6 flex flex-col gap-2 border border-surface-200 hover:border-indigo-500/50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Testing</h3>
            <p class="text-sm text-muted-color">Componentes aislados son más fáciles de testear y validar</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./atomic-design.css']
})
export class AtomicDesignIntroComponent {}