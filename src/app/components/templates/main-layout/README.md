# Main Layout Template

## 📋 Descripción

El `MainLayoutComponent` es un template reutilizable que proporciona una estructura completa de aplicación con:
- ✅ Header fijo con búsqueda y acciones
- ✅ Sidebar colapsable con navegación
- ✅ Área de contenido principal responsive
- ✅ Overlay para móviles
- ✅ Soporte completo para dark mode

## 🚀 Uso Básico

```typescript
import { Component } from '@angular/core';
import { MainLayoutComponent } from '@templates/main-layout';
import { type NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <app-main-layout [navigationItems]="navigation">
      <!-- Tu contenido aquí -->
      <h1>Mi Página</h1>
      <p>Contenido de la página...</p>
    </app-main-layout>
  `
})
export class MyPageComponent {
  protected readonly navigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi-home',
      route: '/dashboard'
    },
    {
      label: 'Settings',
      icon: 'pi-cog',
      route: '/settings'
    }
  ];
}
```

## 📝 API del Componente

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `navigationItems` | `NavigationItem[]` | `[]` | Items de navegación para el sidebar |

### NavigationItem Interface

```typescript
interface NavigationItem {
  label: string;              // Texto a mostrar
  icon: string;               // Icono PrimeIcons (ej: 'pi-home')
  route?: string;             // Ruta de Angular Router
  badge?: string | number;    // Badge opcional (ej: contador)
  children?: NavigationItem[]; // Sub-items (navegación jerárquica)
}
```

## 🎯 Ejemplos de Uso

### Navegación Simple

```typescript
navigation: NavigationItem[] = [
  { label: 'Home', icon: 'pi-home', route: '/' },
  { label: 'Products', icon: 'pi-shopping-cart', route: '/products', badge: '12' },
  { label: 'Users', icon: 'pi-users', route: '/users' }
];
```

### Navegación con Secciones

```typescript
navigation: NavigationItem[] = [
  {
    label: 'Content',
    icon: 'pi-folder',
    children: [
      { label: 'Articles', icon: 'pi-file', route: '/content/articles' },
      { label: 'Media', icon: 'pi-image', route: '/content/media' }
    ]
  },
  {
    label: 'Settings',
    icon: 'pi-cog',
    children: [
      { label: 'Profile', icon: 'pi-user', route: '/settings/profile' },
      { label: 'Security', icon: 'pi-shield', route: '/settings/security' }
    ]
  }
];
```

### Con Badges y Notificaciones

```typescript
navigation: NavigationItem[] = [
  {
    label: 'Messages',
    icon: 'pi-envelope',
    route: '/messages',
    badge: '5'  // ← Badge con contador
  },
  {
    label: 'Notifications',
    icon: 'pi-bell',
    route: '/notifications',
    badge: 'NEW'  // ← Badge con texto
  }
];
```

## 🎨 Características del Layout

### 1. Header Fijo
- Logo/branding personalizable
- Búsqueda global (desktop)
- Botones de acción
- Botón de menú para mobile

### 2. Sidebar Responsive
- **Desktop (≥1024px)**: Siempre visible
- **Mobile (<1024px)**: Colapsable con overlay
- Scroll independiente
- Navegación con router-link activo
- Soporte para badges y sub-menús

### 3. Área de Contenido
- Padding responsive automático
- Ajuste de margen según estado del sidebar
- Content projection para máxima flexibilidad

## 🔧 Comportamiento Responsive

### Desktop (≥1024px)
```
Sidebar Abierto (default):
┌─────────────────────────────────┐
│         Header (fijo)           │
├────────┬────────────────────────┤
│        │                        │
│ Side-  │   Contenido Principal  │
│ bar    │   (padding-left: 16rem)│
│ (fijo) │                        │
│        │                        │
└────────┴────────────────────────┘

Sidebar Cerrado (toggle con [☰]):
┌─────────────────────────────────┐
│         Header (fijo)           │
├─────────────────────────────────┤
│                                 │
│     Contenido Principal         │
│     (full-width, padding: 0)    │
│                                 │
└─────────────────────────────────┘
```

**Características Desktop:**
- Sidebar **abierto por defecto**
- Se puede cerrar haciendo click en el botón [☰] del header
- Contenido se expande/contrae suavemente (transición 0.3s)
- Sin overlay

### Mobile (<1024px)
```
Sidebar Cerrado (default):
┌─────────────────────────────────┐
│         Header (fijo)           │
├─────────────────────────────────┤
│                                 │
│     Contenido Principal         │
│     (full-width)                │
│                                 │
└─────────────────────────────────┘

Sidebar Abierto (toggle con [☰]):
┌─────────────────────────────────┐
│         Header (fijo)           │
├────────┬────────────────────────┤
│        │░░░░░░░░░░░░░░░░░░░░░░░░│
│ Side-  │░░░ Overlay ░░░░░░░░░░░░│
│ bar    │░░░ (cerrar al click) ░░│
│ (over) │░░░░░░░░░░░░░░░░░░░░░░░░│
└────────┴────────────────────────┘
```

**Características Mobile:**
- Sidebar **cerrado por defecto**
- Se abre haciendo click en [☰]
- Overlay oscuro (click para cerrar)
- Se cierra automáticamente al navegar a otro item

## 🔧 Personalización

### Cambiar Colores

Los colores se adaptan automáticamente al theme de PrimeNG:

```typescript
// app.config.ts
providePrimeNG({
  theme: {
    preset: YourCustomPreset,  // ← Cambia el preset
    options: {
      darkModeSelector: '.p-dark'
    }
  }
})
```

### Modificar Ancho del Sidebar

```css
/* En tu componente o styles.css global */
app-sidebar aside {
  width: 20rem !important;  /* Default: 16rem (256px) */
}
```

### Ocultar Elementos del Header

Puedes extender el HeaderComponent o crear tu propio header:

```typescript
import { HeaderComponent } from '@organisms/header';

// Usar tu header personalizado
imports: [MyCustomHeaderComponent, SidebarComponent]
```

## 📦 Componentes Incluidos

### Header Component
- Ubicación: `src/app/components/organisms/header/`
- Eventos: `menuClicked` - Se emite al hacer click en el botón de menú

### Sidebar Component
- Ubicación: `src/app/components/organisms/sidebar/`
- Inputs: `isOpen`, `navigationItems`
- Outputs: `itemClicked` - Se emite al hacer click en un item

## 🎨 Clases CSS Disponibles

El layout usa clases de Tailwind + PrimeUI:

```html
<!-- Spacing -->
<div class="p-6">          <!-- Padding: 1.5rem -->
<div class="gap-4">        <!-- Gap: 1rem -->
<div class="space-y-6">    <!-- Vertical spacing: 1.5rem -->

<!-- Colors -->
<div class="bg-surface-0">        <!-- Background principal -->
<div class="text-color">          <!-- Texto principal -->
<div class="text-muted-color">    <!-- Texto secundario -->
<div class="border-surface-200">  <!-- Bordes -->

<!-- Layout -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">  <!-- Grid responsive -->
<div class="flex items-center justify-between">       <!-- Flexbox -->
```

## ✅ Checklist de Implementación

Al usar este layout en una nueva página:

- [ ] Importar `MainLayoutComponent`
- [ ] Importar `type NavigationItem` de `@organisms/sidebar`
- [ ] Definir array de `navigationItems`
- [ ] Envolver contenido con `<app-main-layout>`
- [ ] Pasar `[navigationItems]` al layout
- [ ] Usar clases de Tailwind/PrimeUI para estilos
- [ ] Probar en mobile y desktop

## 📚 Ver También

- [Header Component](../organisms/header/README.md)
- [Sidebar Component](../organisms/sidebar/README.md)
- [Layout Demo](../../pages/layout-demo/layout-demo.ts) - Ejemplo completo
- [Tailwind Integration](.github/TAILWIND-INTEGRATION.md)

## 🔄 Changelog

- **v1.0.0** - Layout inicial con header y sidebar
- Soporte responsive completo
- Navegación con router-link activo
- Dark mode support
- Content projection
