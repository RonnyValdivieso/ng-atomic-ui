# Theme Toggle Component

## 📋 Descripción
Componente atom-level que proporciona un botón para alternar entre temas claro y oscuro de la aplicación.

## 🎯 Características
- ✅ Animación suave entre iconos (sol/luna)
- ✅ Integración con ThemeService
- ✅ Accesibilidad (aria-label, title)
- ✅ Estados hover y focus
- ✅ Responsive y adaptable
- ✅ Iconos de PrimeNG

## 📦 Uso

### Básico
```html
<app-theme-toggle />
```

### En el Header
```html
<header class="flex items-center justify-between p-4">
  <h1>Mi App</h1>
  <app-theme-toggle />
</header>
```

## 🎨 Diseño

### Estados
- **Light Mode**: Muestra icono de sol (🌞)
- **Dark Mode**: Muestra icono de luna (🌙)
- **Hover**: Fondo sutil gris
- **Focus**: Ring azul de enfoque

### Animaciones
- Rotación 90° al cambiar
- Fade in/out entre iconos
- Duración: 300ms ease-in-out

## 🔧 Propiedades

Este componente no recibe inputs ni emite outputs. Toda la lógica de tema está manejada internamente por el `ThemeService`.

## 🧪 Testing

```typescript
import { ThemeToggleComponent } from '@/components/atoms/theme-toggle';

it('should toggle theme on click', () => {
  const button = fixture.nativeElement.querySelector('button');
  button.click();
  // Theme should toggle
});
```

## 📐 Tailwind Classes

- `w-10 h-10`: Tamaño del botón (40x40px)
- `rounded-lg`: Bordes redondeados
- `hover:bg-surface-100`: Fondo en hover
- `focus:ring-2 focus:ring-primary`: Anillo de enfoque

## ♿ Accesibilidad

- `aria-label`: Describe la acción actual
- `title`: Tooltip informativo
- `type="button"`: Semántica correcta
- Focus ring visible

## 🔗 Dependencias

- `ThemeService`: Servicio de gestión de temas
- `CommonModule`: Directivas básicas de Angular
- PrimeNG Icons: `pi-sun`, `pi-moon`

## 📝 Notas

- El estado del tema se persiste en localStorage
- Los cambios se sincronizan en toda la aplicación vía signals
- Compatible con preferencias del sistema operativo
