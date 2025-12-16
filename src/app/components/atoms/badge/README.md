# Badge Component

El `BadgeComponent` es un átomo del sistema de diseño que permite mostrar etiquetas, contadores, estados y notificaciones de forma clara y consistente.

## 📋 Características

- ✅ **Múltiples variantes**: solid, outline, soft, dot
- ✅ **Sistema de colores**: primary, secondary, success, danger, warning, info, neutral
- ✅ **4 tamaños**: xs, sm, md, lg
- ✅ **Posicionamiento**: top-right, top-left, bottom-right, bottom-left
- ✅ **Estados**: clickable, disabled, pulse, hidden
- ✅ **Contenido flexible**: texto, números, iconos
- ✅ **Accesibilidad completa**: ARIA labels, keyboard navigation
- ✅ **Modo oscuro**: Soporte automático
- ✅ **Utilidades estáticas**: Métodos de conveniencia

## 🎨 Variantes

### Solid (Sólido)
```html
<app-badge text="New" variant="solid" color="primary" />
<app-badge text="5" variant="solid" color="danger" />
```

### Outline (Contorno)
```html
<app-badge text="Draft" variant="outline" color="secondary" />
<app-badge text="Important" variant="outline" color="warning" />
```

### Soft (Suave)
```html
<app-badge text="Success" variant="soft" color="success" />
<app-badge text="Info" variant="soft" color="info" />
```

### Dot (Punto)
```html
<app-badge variant="dot" color="success" />
<app-badge variant="dot" color="danger" [pulse]="true" />
```

## 🎯 Casos de Uso

### Etiquetas de Estado
```html
<!-- Estado de usuario -->
<app-badge text="Active" variant="soft" color="success" />
<app-badge text="Inactive" variant="soft" color="neutral" />

<!-- Estado de pedido -->
<app-badge text="Pending" variant="outline" color="warning" />
<app-badge text="Completed" variant="solid" color="success" />
```

### Contadores y Notificaciones
```html
<!-- Contador simple -->
<app-badge [count]="5" variant="solid" color="danger" size="xs" />

<!-- Notificación con límite -->
<app-badge [count]="150" [maxCount]="99" variant="solid" color="danger" />

<!-- Indicador sin número -->
<app-badge variant="dot" color="danger" [pulse]="true" />
```

### Badges con Iconos
```html
<!-- Badge con icono -->
<app-badge text="Premium" icon="star" variant="solid" color="warning" />

<!-- Solo icono -->
<app-badge icon="check" variant="soft" color="success" size="sm" />
```

### Badges Posicionados (Overlays)
```html
<div style="position: relative; display: inline-block;">
  <button>Messages</button>
  <app-badge 
    [count]="3" 
    variant="solid" 
    color="danger" 
    size="xs"
    position="top-right" />
</div>
```

### Badges Clickables
```html
<app-badge 
  text="Filter" 
  variant="outline" 
  color="primary"
  [clickable]="true"
  (clicked)="toggleFilter()" />
```

## 🛠️ API del Componente

### Inputs

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `variant` | `BadgeVariant` | `'solid'` | Variante visual del badge |
| `color` | `BadgeColor` | `'primary'` | Color del badge |
| `size` | `BadgeSize` | `'sm'` | Tamaño del badge |
| `position` | `BadgePosition` | - | Posición para overlay |
| `text` | `string` | `''` | Texto a mostrar |
| `count` | `number \| null` | `null` | Número/contador a mostrar |
| `maxCount` | `number` | `99` | Límite para mostrar "+" |
| `showZero` | `boolean` | `false` | Mostrar cuando count es 0 |
| `icon` | `string` | `''` | Icono a mostrar |
| `dot` | `boolean` | `false` | Forzar modo dot |
| `clickable` | `boolean` | `false` | Hacer clickeable |
| `disabled` | `boolean` | `false` | Deshabilitar interacción |
| `pulse` | `boolean` | `false` | Animación de pulso |
| `hidden` | `boolean` | `false` | Ocultar badge |
| `ariaLabel` | `string` | - | Label personalizado para accesibilidad |

### Outputs

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `clicked` | `void` | Emitido al hacer click (si clickable) |

### Tipos

```typescript
type BadgeVariant = 'solid' | 'outline' | 'soft' | 'dot';
type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
```

## 🔧 Métodos Estáticos de Conveniencia

### Factory Methods
```typescript
// Badges predefinidos
BadgeComponent.primary('New');           // Badge primario
BadgeComponent.success('Done');          // Badge de éxito
BadgeComponent.danger('Error');          // Badge de error
BadgeComponent.warning('Alert');         // Badge de advertencia

// Badges especiales
BadgeComponent.dot('primary');           // Punto de estado
BadgeComponent.count(5);                 // Contador simple
BadgeComponent.notification(3, 'top-right'); // Notificación posicionada
```

### Utility Methods
```typescript
// Formatear contadores grandes
BadgeComponent.formatCount(150, 99);     // "99+"

// Colores por prioridad
BadgeComponent.getNotificationColor('high');    // 'danger'
BadgeComponent.getNotificationColor('medium');  // 'warning'
BadgeComponent.getNotificationColor('low');     // 'info'

// Configuraciones predefinidas
BadgeComponent.createCountBadgeConfig(25, {
  maxCount: 100,
  color: 'primary',
  size: 'md'
});

BadgeComponent.createStatusDotConfig('success', true); // Con pulse
```

## 📱 Responsive Design

Los badges se adaptan automáticamente:

```css
/* Los tamaños son responsivos */
.badge--xs { min-width: 1rem; height: 1rem; }      /* 16x16px */
.badge--sm { min-width: 1.25rem; height: 1.25rem; } /* 20x20px */
.badge--md { min-width: 1.5rem; height: 1.5rem; }   /* 24x24px */
.badge--lg { min-width: 2rem; height: 2rem; }       /* 32x32px */
```

## ♿ Accesibilidad

### ARIA Support
- **aria-label**: Descripción del contenido
- **aria-disabled**: Estado deshabilitado
- **aria-hidden**: Para elementos decorativos
- **role="button"**: Cuando es clickeable
- **tabindex**: Navegación por teclado

### Navegación por Teclado
- **Enter/Space**: Activar badge clickeable
- **Tab**: Navegar entre badges clickeables

### Alto Contraste
```css
@media (prefers-contrast: high) {
  .badge--outline { border-width: 2px; }
  .badge--soft { border: 1px solid currentColor; }
}
```

### Reducción de Movimiento
```css
@media (prefers-reduced-motion: reduce) {
  .badge { transition: none; }
  .badge--pulse { animation: none; }
}
```

## 🎨 Personalización

### Variables CSS Disponibles
```css
--p-primary-500: Color primario
--p-surface-500: Color secundario
--p-primary-50: Fondo suave
--p-border-radius-xl: Border radius
```

### Clases CSS Generadas
```css
.badge                    /* Base */
.badge--{variant}         /* solid, outline, soft, dot */
.badge--{color}           /* primary, success, danger, etc. */
.badge--{size}            /* xs, sm, md, lg */
.badge--{position}        /* top-right, bottom-left, etc. */
.badge--clickable         /* Interactivo */
.badge--disabled          /* Deshabilitado */
.badge--pulse             /* Animación */
.badge--has-icon          /* Con icono */
.badge--positioned        /* Con posición absoluta */
```

## 💡 Mejores Prácticas

### ✅ Hacer
- Usar colores semánticamente apropiados (success=verde, danger=rojo)
- Mantener textos cortos y descriptivos
- Usar dot badges para estados simples
- Posicionar notifications en esquinas superiores derechas
- Usar pulse para badges importantes que requieren atención

### ❌ Evitar
- Textos largos en badges pequeños
- Múltiples badges de alta prioridad juntos
- Badges clickeables sin feedback visual claro
- Usar badges como botones principales de navegación
- Abusar de la animación pulse

### 📏 Recomendaciones de Tamaño
- **xs**: Contadores, notificaciones pequeñas
- **sm**: Etiquetas de estado, tags
- **md**: Badges principales, filtros
- **lg**: Badges destacados, llamadas a la acción

### 🎨 Guía de Colores
- **primary**: Acciones principales, elementos destacados
- **secondary**: Información secundaria, estados neutros
- **success**: Confirmaciones, estados completados
- **danger**: Errores, advertencias críticas, contadores altos
- **warning**: Advertencias, estados pendientes
- **info**: Información adicional, tips
- **neutral**: Estados por defecto, placeholders

## 🔗 Componentes Relacionados

- **Icon**: Para iconos dentro del badge
- **Button**: Para acciones similares pero más prominentes
- **Chip**: Para elementos interactivos más complejos
- **Tooltip**: Para información adicional en hover

## 📚 Ejemplos Completos

### Dashboard de Notificaciones
```html
<div class="notification-badges">
  <div class="badge-item">
    <app-icon name="bell" size="md" />
    <app-badge [count]="notifications" color="danger" size="xs" position="top-right" />
  </div>
  
  <div class="badge-item">
    <app-icon name="message-circle" size="md" />
    <app-badge [count]="messages" color="primary" size="xs" position="top-right" />
  </div>
</div>
```

### Lista de Estados
```html
<div class="status-list">
  <div class="status-item">
    <span>Usuario 1</span>
    <app-badge variant="dot" color="success" />
  </div>
  
  <div class="status-item">
    <span>Usuario 2</span>
    <app-badge variant="dot" color="warning" [pulse]="true" />
  </div>
  
  <div class="status-item">
    <span>Usuario 3</span>
    <app-badge variant="dot" color="neutral" />
  </div>
</div>
```

### Filtros Interactivos
```html
<div class="filter-badges">
  <app-badge 
    text="Active" 
    variant="solid" 
    color="success"
    [clickable]="true"
    (clicked)="toggleActiveFilter()" />
    
  <app-badge 
    text="Pending" 
    variant="outline" 
    color="warning"
    [clickable]="true"
    (clicked)="togglePendingFilter()" />
    
  <app-badge 
    text="Completed" 
    variant="soft" 
    color="primary"
    [clickable]="true"
    (clicked)="toggleCompletedFilter()" />
</div>
```