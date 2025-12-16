# Atoms - Componentes Básicos

Los **Atoms** son los componentes más básicos e indivisibles del sistema de diseño. Representan elementos UI fundamentales que no pueden descomponerse más sin perder su funcionalidad.

## 📋 Componentes Disponibles

### 🔤 [Icon](./icon/README.md)
Componente para mostrar iconos de PrimeIcons con diferentes tamaños y estados.
- ✅ Catálogo completo de PrimeIcons
- ✅ 5 tamaños predefinidos (xs, sm, base, lg, xl)
- ✅ Estados: loading, disabled
- ✅ Colores personalizables
- ✅ Accesibilidad completa

**Casos de uso**: Iconografía general, indicadores visuales, decoración

### 👤 [Avatar](./avatar/README.md)
Componente para mostrar imágenes de perfil con indicadores de estado y modos de visualización.
- ✅ Múltiples fuentes: imagen, iniciales, placeholder
- ✅ 5 tamaños (xs, sm, md, lg, xl)  
- ✅ Formas: círculo, cuadrado, redondeado
- ✅ Indicadores de estado con posicionamiento
- ✅ Estados de carga y error
- ✅ Accesibilidad completa

**Casos de uso**: Perfiles de usuario, avatares de comentarios, listas de miembros

### 🏷️ [Badge](./badge/README.md)
Componente para mostrar etiquetas, contadores, estados y notificaciones.
- ✅ 4 variantes: solid, outline, soft, dot
- ✅ 7 colores semánticos + neutral
- ✅ 4 tamaños (xs, sm, md, lg)
- ✅ Posicionamiento para overlays
- ✅ Estados interactivos y animaciones
- ✅ Contadores con límites configurables
- ✅ Utilidades estáticas

**Casos de uso**: Estados de elementos, contadores, notificaciones, etiquetas

## 🏗️ Principios de los Atoms

### Indivisibilidad
Los atoms no pueden dividirse en componentes más pequeños sin perder su función principal.

```html
<!-- ✅ Correcto: Atom indivisible -->
<app-icon name="check" size="sm" />

<!-- ❌ Incorrecto: Dividir el atom perdería su función -->
<span class="icon-wrapper">
  <i class="pi pi-check"></i>
</span>
```

### Reutilización Máxima
Cada atom debe ser altamente reutilizable en diferentes contextos.

```html
<!-- ✅ El mismo Icon atom en diferentes contextos -->
<app-icon name="search" />        <!-- En buscador -->
<app-icon name="check" />         <!-- En confirmación -->
<app-icon name="user" />          <!-- En perfil -->
```

### Sin Dependencias entre Atoms
Los atoms no deben depender de otros atoms directamente.

```typescript
// ✅ Correcto: Atom independiente
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule], // Solo dependencias externas
})
export class BadgeComponent { }

// ❌ Incorrecto: Dependencia entre atoms
@Component({
  imports: [IconComponent], // No depender de otros atoms
})
export class BadgeComponent { }
```

### Comportamiento Consistente
Todos los atoms deben seguir patrones consistentes de API.

```typescript
// ✅ Patrón consistente en todos los atoms
readonly size = input<AtomSize>('md');
readonly disabled = input<boolean>(false);
readonly clicked = output<void>();
```

## 📐 Patrones de Implementación

### Estructura de Archivos
```
atom-name/
├── atom-name.ts           # Componente principal
├── atom-name.html         # Template
├── atom-name.css          # Estilos
├── atom-name.spec.ts      # Tests unitarios
├── index.ts               # Barrel export
└── README.md              # Documentación
```

### Configuración Base
```typescript
@Component({
  selector: 'app-atom-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atom-name.html',
  styleUrls: ['./atom-name.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomNameComponent {
  // Inputs usando signals
  readonly variant = input<AtomVariant>('default');
  readonly size = input<AtomSize>('md');
  readonly disabled = input<boolean>(false);
  
  // Outputs
  readonly clicked = output<void>();
  
  // Computed properties
  readonly classes = computed(() => [
    'atom-name',
    `atom-name--${this.variant()}`,
    `atom-name--${this.size()}`,
    this.disabled() ? 'atom-name--disabled' : ''
  ].filter(Boolean).join(' '));
}
```

### Estilos Estándar
```css
/* Base component */
.atom-name {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  -webkit-user-select: none;
  user-select: none;
}

/* Variants */
.atom-name--primary { /* variant styles */ }
.atom-name--secondary { /* variant styles */ }

/* Sizes */
.atom-name--xs { /* size styles */ }
.atom-name--sm { /* size styles */ }
.atom-name--md { /* size styles */ }
.atom-name--lg { /* size styles */ }

/* States */
.atom-name--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Dark mode */
[data-theme="dark"] .atom-name {
  /* dark mode adjustments */
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .atom-name { transition: none; }
}
```

## 🧪 Testing de Atoms

### Cobertura Requerida
- ✅ Renderizado básico
- ✅ Props/Inputs funcionan correctamente
- ✅ Eventos se emiten
- ✅ Estados (disabled, loading, etc.)
- ✅ Variantes y tamaños
- ✅ Accesibilidad (ARIA, keyboard)
- ✅ Métodos estáticos (si aplican)

### Patrón de Testing
```typescript
describe('AtomNameComponent', () => {
  let component: AtomNameComponent;
  let fixture: ComponentFixture<AtomNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomNameComponent]
    }).compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Variants', () => {
    // Test all variants
  });

  describe('Sizes', () => {
    // Test all sizes
  });

  describe('States', () => {
    // Test disabled, loading, etc.
  });

  describe('Accessibility', () => {
    // Test ARIA attributes, keyboard navigation
  });
});
```

## 🔄 Composición con Molecules

Los atoms se combinan para crear molecules:

```html
<!-- Molecule: SearchBox usa atoms -->
<div class="search-box">
  <app-icon name="search" size="sm" />  <!-- Atom -->
  <input type="text" />                 <!-- Atom -->
  <app-icon name="times" size="sm" />   <!-- Atom -->
</div>

<!-- Molecule: UserProfile usa atoms -->
<div class="user-profile">
  <app-avatar src="user.jpg" size="md" />  <!-- Atom -->
  <app-badge text="Online" color="success" />  <!-- Atom -->
</div>
```

## 📚 Guías de Uso

### ✅ Mejores Prácticas
- Mantener atoms simples y enfocados
- Usar signals para reactividad
- Implementar accesibilidad completa
- Documentar todos los casos de uso
- Testing exhaustivo (>90% cobertura)
- Consistencia en API entre atoms

### ❌ Antipatrones
- Atoms que dependen de otros atoms
- Lógica de negocio en atoms
- Estados compartidos entre atoms
- Atoms específicos de páginas
- Saltarse pruebas de accesibilidad

### 🎯 Cuándo Crear un Nuevo Atom
1. **Elemento indivisible**: No puede simplificarse más
2. **Altamente reutilizable**: Se usará en múltiples contextos
3. **Función específica**: Tiene un propósito claro y único
4. **Independiente**: No requiere otros componentes custom

### 🔧 Cuándo NO Crear un Atom
1. **Demasiado específico**: Solo se usa en un lugar
2. **Complejo**: Requiere múltiples sub-elementos
3. **Lógica de negocio**: Maneja datos específicos de dominio
4. **Dependencias**: Necesita otros componentes custom

## 🎨 Sistema de Diseño

### Tokens Compartidos
```css
/* Colores base */
--atom-primary: var(--p-primary-500);
--atom-secondary: var(--p-surface-500);
--atom-success: #10b981;
--atom-danger: #ef4444;
--atom-warning: #f59e0b;
--atom-info: #0ea5e9;

/* Tamaños */
--atom-size-xs: 1rem;
--atom-size-sm: 1.25rem;
--atom-size-md: 1.5rem;
--atom-size-lg: 2rem;
--atom-size-xl: 2.5rem;

/* Espaciado */
--atom-spacing-xs: 0.25rem;
--atom-spacing-sm: 0.5rem;
--atom-spacing-md: 0.75rem;
--atom-spacing-lg: 1rem;
```

### Consistencia Visual
Todos los atoms siguen el mismo sistema:
- **Bordes**: `var(--p-border-radius-md)` por defecto
- **Transiciones**: `all 0.2s ease-in-out`
- **Focus**: Ring con color primario
- **Disabled**: 50% opacidad + pointer-events: none

## 📈 Roadmap

### Próximos Atoms
- [ ] **Button**: Botones con variantes y estados
- [ ] **Input**: Campos de entrada básicos
- [ ] **Label**: Etiquetas de formulario
- [ ] **Separator**: Líneas divisorias
- [ ] **Skeleton**: Placeholders de carga
- [ ] **Progress**: Barras e indicadores de progreso

### Mejoras Planificadas
- [ ] Tokens de diseño más granulares
- [ ] Soporte para temas personalizados
- [ ] Animaciones más sofisticadas
- [ ] Mejor soporte para RTL
- [ ] Optimizaciones de performance

---

## 🔗 Referencias

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PrimeNG Design Tokens](https://primeng.org/theming)