# TieredMenu Atom

Componente de menú desplegable multinivel basado en PrimeNG TieredMenu.

## Características

- ✅ Menú multinivel con submenús anidados
- ✅ Modo popup (overlay) o estático
- ✅ Tres tamaños: small, medium, large
- ✅ Dos variantes: default, outlined
- ✅ Soporte completo para modo oscuro
- ✅ Iconos opcionales de PrimeIcons
- ✅ Separadores entre elementos
- ✅ Estados: hover, active, disabled
- ✅ Animaciones suaves
- ✅ Accesibilidad con navegación por teclado
- ✅ Responsive design

## Uso Básico

```typescript
import { Component } from '@angular/core';
import { TieredMenuComponent } from '@/components/atoms/tiered-menu';
import { MenuItem } from 'primeng/api';

@Component({
  template: `
    <!-- Modo Popup (requiere un trigger) -->
    <app-button (clicked)="menu.toggle($event)">
      Menú
    </app-button>
    <app-tiered-menu 
      #menu
      [model]="items"
      [popup]="true">
    </app-tiered-menu>

    <!-- Modo Estático -->
    <app-tiered-menu 
      [model]="items"
      [popup]="false">
    </app-tiered-menu>
  `
})
export class MyComponent {
  items: MenuItem[] = [
    {
      label: 'Archivo',
      icon: 'pi pi-file',
      items: [
        { label: 'Nuevo', icon: 'pi pi-plus', command: () => this.newFile() },
        { label: 'Abrir', icon: 'pi pi-folder-open' },
        { separator: true },
        { label: 'Guardar', icon: 'pi pi-save' }
      ]
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Deshacer', icon: 'pi pi-undo' },
        { label: 'Rehacer', icon: 'pi pi-refresh' }
      ]
    }
  ];
}
```

## Props (Inputs)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `model` | `MenuItem[]` | `[]` | Array de elementos del menú |
| `popup` | `boolean` | `true` | Si el menú es popup o estático |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño del menú |
| `variant` | `'default' \| 'outlined'` | `'default'` | Variante visual |
| `disabled` | `boolean` | `false` | Deshabilita el menú |
| `appendTo` | `any` | `'body'` | Elemento al que se adjunta el popup |
| `autoZIndex` | `boolean` | `true` | Gestión automática del z-index |
| `baseZIndex` | `number` | `0` | Z-index base |
| `styleClass` | `string` | `''` | Clases CSS adicionales |

## Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `itemClick` | `{ originalEvent: Event; item: MenuItem }` | Se emite al hacer click en un elemento |
| `menuShow` | `void` | Se emite cuando el menú se muestra |
| `menuHide` | `void` | Se emite cuando el menú se oculta |

## Métodos Públicos

```typescript
// Toggle menu visibility (solo popup mode)
menu.toggle(event: Event): void

// Show menu (solo popup mode)
menu.show(event: Event): void

// Hide menu (solo popup mode)
menu.hide(): void
```

## Ejemplos

### Tamaños

```html
<!-- Small -->
<app-tiered-menu [model]="items" size="small"></app-tiered-menu>

<!-- Medium (default) -->
<app-tiered-menu [model]="items" size="medium"></app-tiered-menu>

<!-- Large -->
<app-tiered-menu [model]="items" size="large"></app-tiered-menu>
```

### Variantes

```html
<!-- Default with shadow -->
<app-tiered-menu [model]="items" variant="default"></app-tiered-menu>

<!-- Outlined without shadow -->
<app-tiered-menu [model]="items" variant="outlined"></app-tiered-menu>
```

### Menú Complejo

```typescript
items: MenuItem[] = [
  {
    label: 'Archivo',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Nuevo',
        icon: 'pi pi-plus',
        items: [
          { label: 'Documento', icon: 'pi pi-file' },
          { label: 'Hoja de cálculo', icon: 'pi pi-table' },
          { label: 'Presentación', icon: 'pi pi-chart-bar' }
        ]
      },
      { label: 'Abrir', icon: 'pi pi-folder-open' },
      { separator: true },
      { label: 'Cerrar', icon: 'pi pi-times', disabled: true }
    ]
  },
  {
    label: 'Editar',
    icon: 'pi pi-pencil',
    items: [
      { label: 'Copiar', icon: 'pi pi-copy' },
      { label: 'Pegar', icon: 'pi pi-paste' }
    ]
  }
];
```

### Con Eventos

```html
<app-tiered-menu 
  [model]="items"
  (itemClick)="handleMenuClick($event)"
  (menuShow)="onMenuShow()"
  (menuHide)="onMenuHide()">
</app-tiered-menu>
```

```typescript
handleMenuClick(event: { originalEvent: Event; item: MenuItem }) {
  console.log('Item clicked:', event.item.label);
}

onMenuShow() {
  console.log('Menu opened');
}

onMenuHide() {
  console.log('Menu closed');
}
```

## MenuItem Interface

```typescript
interface MenuItem {
  label?: string;           // Texto del elemento
  icon?: string;           // Icono de PrimeIcons
  command?: (event) => void; // Callback al hacer click
  items?: MenuItem[];      // Submenú
  separator?: boolean;     // Si es un separador
  disabled?: boolean;      // Si está deshabilitado
  visible?: boolean;       // Si es visible
  routerLink?: any;        // Para navegación con Angular Router
  url?: string;            // URL externa
  target?: string;         // Target para URLs (_blank, etc)
  badge?: string;          // Badge text
  badgeStyleClass?: string; // Badge CSS class
}
```

## Casos de Uso

- Menús de aplicación (File, Edit, View, etc.)
- Menús contextuales
- Navegación jerárquica
- Menús de acciones con categorías
- Dropdowns complejos con múltiples niveles

## Mejores Prácticas

1. **Organización**: Agrupa acciones relacionadas
2. **Profundidad**: Limita a 3 niveles de anidamiento
3. **Separadores**: Usa separadores para dividir grupos
4. **Iconos**: Incluye iconos para mejor reconocimiento
5. **Comandos**: Implementa callbacks para acciones
6. **Accesibilidad**: Usa labels descriptivos
7. **Performance**: No crear menús con cientos de elementos

## Accesibilidad

- ✅ Navegación completa con teclado (flechas, Enter, Esc)
- ✅ Focus visible en elementos
- ✅ ARIA labels automáticos
- ✅ Soporte para lectores de pantalla
