# Sidebar Component

## 📋 Descripción

El `SidebarComponent` es un componente organism que proporciona navegación lateral con soporte para:
- ✅ Items de navegación con iconos
- ✅ Badges de notificación
- ✅ Navegación jerárquica (sub-menús)
- ✅ Router-link activo automático
- ✅ Responsive (colapsable en mobile)
- ✅ Dark mode support

## 🚀 Uso Básico

```typescript
import { Component, signal } from '@angular/core';
import { SidebarComponent, type NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <app-sidebar 
      [isOpen]="sidebarOpen()"
      [navigationItems]="navigation"
      (itemClicked)="onItemClick($event)">
    </app-sidebar>
  `
})
export class ExampleComponent {
  sidebarOpen = signal(false);
  
  navigation: NavigationItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Settings', icon: 'pi-cog', route: '/settings' }
  ];
  
  onItemClick(item: NavigationItem) {
    console.log('Clicked:', item.label);
  }
}
```

## 📝 API del Componente

### Inputs

| Input | Tipo | Required | Default | Descripción |
|-------|------|----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | Controla si el sidebar está visible |
| `navigationItems` | `NavigationItem[]` | ✅ | `[]` | Array de items de navegación |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `itemClicked` | `NavigationItem` | Emite cuando se hace click en un item |

### NavigationItem Interface

```typescript
interface NavigationItem {
  label: string;              // Texto del item
  icon: string;               // Icono PrimeIcons (sin prefijo 'pi-')
  route?: string;             // Ruta opcional para navegación
  badge?: string | number;    // Badge de notificación
  children?: NavigationItem[]; // Sub-items opcionales
}
```

## 🎯 Ejemplos de Uso

### Navegación Simple

```typescript
navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    icon: 'pi-home',
    route: '/'
  },
  {
    label: 'Profile',
    icon: 'pi-user',
    route: '/profile'
  },
  {
    label: 'Messages',
    icon: 'pi-envelope',
    route: '/messages',
    badge: '5'  // ← Badge numérico
  }
];
```

### Navegación con Secciones

```typescript
navigationItems: NavigationItem[] = [
  // Items normales
  {
    label: 'Dashboard',
    icon: 'pi-home',
    route: '/dashboard'
  },
  
  // Sección con children
  {
    label: 'Components',  // ← Título de sección
    icon: 'pi-box',
    children: [
      { label: 'Atoms', icon: 'pi-circle', route: '/components/atoms' },
      { label: 'Molecules', icon: 'pi-stop-circle', route: '/components/molecules' },
      { label: 'Organisms', icon: 'pi-th-large', route: '/components/organisms' }
    ]
  },
  
  // Más items
  {
    label: 'Settings',
    icon: 'pi-cog',
    route: '/settings'
  }
];
```

### Navegación con Badges

```typescript
navigationItems: NavigationItem[] = [
  {
    label: 'Inbox',
    icon: 'pi-inbox',
    route: '/inbox',
    badge: '12'  // ← Badge de texto
  },
  {
    label: 'Notifications',
    icon: 'pi-bell',
    route: '/notifications',
    badge: 'NEW'  // ← Badge con texto
  },
  {
    label: 'Updates',
    icon: 'pi-download',
    route: '/updates',
    badge: 3  // ← Badge numérico
  }
];
```

### Item sin Ruta (Solo Acción)

```typescript
navigationItems: NavigationItem[] = [
  {
    label: 'Export Data',
    icon: 'pi-download'
    // Sin route: solo dispara itemClicked
  }
];

// En el componente
onItemClick(item: NavigationItem) {
  if (item.label === 'Export Data') {
    this.exportData();
  }
}
```

## 🎨 Estilos y Personalización

### Clases CSS Aplicadas

```css
/* Item normal */
.flex.items-center.gap-3.px-4.py-3.rounded-lg

/* Item activo (con ruta activa) */
.bg-primary.text-primary-contrast

/* Item hover */
.hover:bg-surface-100

/* Badge */
.px-2.py-1.text-xs.bg-primary.text-primary-contrast.rounded-full
```

### Personalizar Colores

Los colores se adaptan automáticamente al theme:

```typescript
// app.config.ts
providePrimeNG({
  theme: {
    preset: YourPreset,
    options: {
      darkModeSelector: '.p-dark'
    }
  }
})
```

### Modificar Ancho

```css
/* En tu componente parent */
app-sidebar aside {
  width: 20rem !important;  /* Default: 16rem (256px) */
}
```

### Customizar Iconos

```typescript
navigationItems: NavigationItem[] = [
  {
    label: 'Custom',
    icon: 'pi-star',  // ← Cualquier icono de PrimeIcons
    route: '/custom'
  }
];
```

Ver iconos disponibles: https://primeng.org/icons

## 📱 Comportamiento Responsive

### Desktop (≥1024px)
- Sidebar siempre visible (`transform: translateX(0)`)
- No se puede cerrar
- Overlay no aparece

### Mobile (<1024px)
- Sidebar oculto por default (`transform: translateX(-100%)`)
- Se abre cuando `isOpen = true`
- Overlay oscuro aparece
- Click en overlay cierra el sidebar

## 🔧 Control de Estado

### Controlado desde Parent

```typescript
export class ParentComponent {
  sidebarOpen = signal(false);
  
  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }
  
  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
```

### Auto-cerrar en Mobile

```typescript
onItemClick(item: NavigationItem) {
  // Cerrar sidebar en mobile después de navegación
  if (window.innerWidth < 1024) {
    this.sidebarOpen.set(false);
  }
}
```

## 🎯 Características Avanzadas

### Router Link Activo

El sidebar automáticamente aplica estilos al item activo basándose en la ruta actual:

```typescript
// Si estás en /dashboard, este item tendrá clase .bg-primary
{
  label: 'Dashboard',
  icon: 'pi-home',
  route: '/dashboard'  // ← Router detecta automáticamente
}
```

### Scroll Independiente

El sidebar tiene scroll propio con scrollbar personalizado:

```css
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-thumb {
  background: var(--p-surface-300);
  border-radius: 3px;
}
```

### Transiciones Suaves

```css
aside {
  transition: transform 0.3s ease-in-out;
}
```

## 🧪 Ejemplo Completo

```typescript
import { Component, signal } from '@angular/core';
import { SidebarComponent, type NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <app-sidebar 
      [isOpen]="sidebarOpen()"
      [navigationItems]="navigation"
      (itemClicked)="handleItemClick($event)">
    </app-sidebar>
    
    <button (click)="toggleSidebar()">Toggle Menu</button>
  `
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true);
  
  navigation: NavigationItem[] = [
    // Main items
    {
      label: 'Dashboard',
      icon: 'pi-home',
      route: '/admin/dashboard'
    },
    {
      label: 'Analytics',
      icon: 'pi-chart-line',
      route: '/admin/analytics',
      badge: 'NEW'
    },
    
    // Section with children
    {
      label: 'Content',
      icon: 'pi-folder',
      children: [
        { label: 'Posts', icon: 'pi-file', route: '/admin/posts', badge: '24' },
        { label: 'Media', icon: 'pi-image', route: '/admin/media' },
        { label: 'Comments', icon: 'pi-comment', route: '/admin/comments', badge: '5' }
      ]
    },
    
    // More items
    {
      label: 'Users',
      icon: 'pi-users',
      route: '/admin/users'
    },
    {
      label: 'Settings',
      icon: 'pi-cog',
      children: [
        { label: 'General', icon: 'pi-sliders-h', route: '/admin/settings/general' },
        { label: 'Security', icon: 'pi-shield', route: '/admin/settings/security' },
        { label: 'Billing', icon: 'pi-credit-card', route: '/admin/settings/billing' }
      ]
    }
  ];
  
  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }
  
  handleItemClick(item: NavigationItem) {
    console.log('Clicked:', item.label);
    
    // Auto-close on mobile
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }
}
```

## ✅ Checklist

Al implementar el sidebar:

- [ ] Importar `SidebarComponent` y `NavigationItem`
- [ ] Definir array de `navigationItems`
- [ ] Crear signal para `isOpen`
- [ ] Pasar inputs al componente
- [ ] Manejar evento `itemClicked`
- [ ] Probar responsive (mobile/desktop)
- [ ] Verificar router-link activo
- [ ] Probar badges si los usas

## 📚 Ver También

- [Main Layout Template](../templates/main-layout/README.md) - Usa este sidebar
- [Header Component](./header/README.md) - Componente complementario
- [PrimeIcons](https://primeng.org/icons) - Iconos disponibles

## 🔄 Changelog

- **v1.0.0** - Sidebar inicial
- Navegación con router-link
- Soporte para badges
- Navegación jerárquica
- Responsive completo
