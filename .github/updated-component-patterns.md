# Patrones de Componentes Actualizados - Angular Modern Practices

## 🎯 Resumen de Cambios

Este documento establece los nuevos patrones para crear componentes siguiendo la guía oficial actualizada de Angular, manteniendo nuestro sistema de Atomic Design.

## 📁 Nueva Nomenclatura de Archivos (Angular Style Guide Oficial)

### ❌ Nomenclatura Anterior (Angular CLI)
```bash
user-profile/
├── user-profile.component.ts
├── user-profile.component.html  
├── user-profile.component.css
└── user-profile.component.spec.ts
```

### ✅ Nueva Nomenclatura Recomendada (Angular 20+)
```bash
user-profile/
├── user-profile.ts              # Component class
├── user-profile.html            # Template
├── user-profile.css             # Styles  
└── user-profile.spec.ts         # Tests
```

### 🎯 Razones del Cambio
- **Simplicidad**: Menos redundancia en nombres de archivos
- **Claridad**: El directorio ya indica que es un componente
- **Consistencia**: Sigue el patrón estándar de TypeScript
- **Brevedad**: Nombres de archivos más cortos y limpios

## 📋 Template de Componente Moderno

### 🔧 Estructura Base
```typescript
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComponentProps {
  // Definir interfaces para props complejas
}

/**
 * Descripción del componente con ejemplo de uso
 * @example
 * <app-component-name 
 *   prop1="value" 
 *   (action)="handleAction()">
 *   Content
 * </app-component-name>
 */
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.html',
  styleUrls: ['./component-name.css']
})
export class ComponentNameComponent {
  // ✅ readonly inputs usando signal-based API
  readonly prop1 = input<string>('defaultValue');
  readonly prop2 = input<boolean>(false);
  readonly complexProp = input<ComponentProps>();

  // ✅ readonly outputs
  readonly action = output<string>();
  readonly stateChange = output<ComponentProps>();

  // ✅ signals privados para estado interno
  private readonly _internalState = signal<any>(null);

  // ✅ computed values para uso en template (protected)
  protected readonly cssClasses = computed(() => 
    `component ${this.prop2() ? 'component--active' : ''}`
  );

  protected readonly isReady = computed(() => 
    this.prop1() && this._internalState()
  );

  // ✅ protected methods with descriptive names
  protected handleUserAction(): void {
    if (this.isReady()) {
      this.action.emit(this.prop1());
    }
  }

  protected updateInternalState(newState: any): void {
    this._internalState.set(newState);
  }
}
```

### 🎨 Template Patterns
```html
<!-- ✅ class binding directo -->
<div [class]="cssClasses()" 
     [class.loading]="isLoading()"
     [class.error]="hasError()">

<!-- ✅ Usar signals en template con () -->
@if (isVisible()) {
  <div>{{ content() }}</div>
}

@for (item of items(); track item.id) {
  <div [class.selected]="item.selected">
    {{ item.name }}
  </div>
}

<!-- ✅ Event handlers con nombres descriptivos -->
<button (click)="handleSubmitForm()" 
        (keydown.enter)="handleSubmitForm()">
  {{ buttonText() }}
</button>
</div>
```

## 🔄 Migración de Componentes Existentes

### Paso 1: Actualizar Imports
```typescript
// ❌ Before
import { Component, Input, Output, EventEmitter } from '@angular/core';

// ✅ After  
import { Component, computed, input, output, signal } from '@angular/core';
```

### Paso 2: Convertir Inputs/Outputs
```typescript
// ❌ Before
@Input() variant: string = 'primary';
@Output() clicked = new EventEmitter<void>();

// ✅ After
readonly variant = input<string>('primary');
readonly clicked = output<void>();
```

### Paso 3: Actualizar Template
```html
<!-- ❌ Before -->
<div [class]="cssClasses" [hidden]="!visible">
  {{ label }}
</div>

<!-- ✅ After -->
<div [class]="cssClasses()" [class.hidden]="!visible()">
  {{ label() }}
</div>
```

### Paso 4: Cambiar Visibilidad de Métodos
```typescript
// ❌ Before (public by default)
handleClick(): void { }

// ✅ After (protected for template)
protected handleClick(): void { }
```

## 🎯 Patrones Específicos por Nivel Atomic

### Atoms - Elementos Básicos
```typescript
@Component({
  selector: 'app-button', // Generic prefix for design system
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class ButtonComponent {
  // Appearance properties
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input<boolean>(false);
  
  // Interaction events
  readonly clicked = output<void>();
  
  // Computed states
  protected readonly buttonClasses = computed(() => 
    `btn btn--${this.variant()} btn--${this.size()}`
  );
  
  // Descriptive actions
  protected handleButtonClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

### Molecules - Componentes Compuestos
```typescript
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormFieldComponent],
  templateUrl: './search-box.html',
  styleUrls: ['./search-box.css']
})
export class SearchBoxComponent {
  // Configuration props
  readonly placeholder = input<string>('Search...');
  readonly disabled = input<boolean>(false);
  
  // Internal state
  private readonly _searchTerm = signal<string>('');
  
  // Events
  readonly search = output<string>();
  readonly clear = output<void>();
  
  // Estados derivados
  protected readonly hasSearchTerm = computed(() => 
    this._searchTerm().length > 0
  );
  
  protected readonly searchBoxClasses = computed(() => [
    'search-box',
    this.disabled() ? 'search-box--disabled' : '',
    this.hasSearchTerm() ? 'search-box--active' : ''
  ].filter(Boolean).join(' '));
  
  // Specific actions
  protected handleSearchSubmit(): void {
    const term = this._searchTerm().trim();
    if (term) {
      this.search.emit(term);
    }
  }
  
  protected handleClearSearch(): void {
    this._searchTerm.set('');
    this.clear.emit();
  }
  
  protected handleSearchTermChange(term: string): void {
    this._searchTerm.set(term);
  }
}
```

### Organisms - Componentes de Funcionalidad
```typescript
@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SearchBoxComponent],
  templateUrl: './user-navigation.html',
  styleUrls: ['./user-navigation.css']
})
export class UserNavigationComponent {
  // Datos externos
  readonly currentUser = input<User>();
  readonly menuItems = input<MenuItem[]>([]);
  
  // Estado interno de UI
  private readonly _isMenuOpen = signal<boolean>(false);
  private readonly _activeMenuItem = signal<string | null>(null);
  
  // Navigation events
  readonly navigate = output<string>();
  readonly logout = output<void>();
  
  // Computed states for template
  protected readonly navigationClasses = computed(() => [
    'navigation',
    this._isMenuOpen() ? 'navigation--open' : '',
    this.currentUser() ? 'navigation--authenticated' : ''
  ].filter(Boolean).join(' '));
  
  protected readonly isAuthenticated = computed(() => 
    !!this.currentUser()
  );
  
  // Navigation actions
  protected handleMenuToggle(): void {
    this._isMenuOpen.update(open => !open);
  }
  
  protected handleMenuItemClick(itemId: string): void {
    this._activeMenuItem.set(itemId);
    this._isMenuOpen.set(false);
    this.navigate.emit(itemId);
  }
  
  protected handleLogoutRequest(): void {
    this._isMenuOpen.set(false);
    this.logout.emit();
  }
}
```

## 🎨 Estilos con Variables CSS

### Variables por Componente
```css
/* button.component.css */
.btn {
  /* Variables locales del componente */
  --btn-padding-x: 1rem;
  --btn-padding-y: 0.5rem;
  --btn-border-radius: 0.375rem;
  --btn-font-weight: 500;
  
  /* Uso de variables globales */
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  
  padding: var(--btn-padding-y) var(--btn-padding-x);
  border-radius: var(--btn-border-radius);
  font-weight: var(--btn-font-weight);
}

/* Variantes usando class binding */
.btn--secondary {
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
}

.btn--large {
  --btn-padding-x: 1.5rem;
  --btn-padding-y: 0.75rem;
  font-size: 1.125rem;
}

.btn--disabled {
  opacity: 0.6;
  pointer-events: none;
}
```

## 🧪 Testing con Nuevos Patrones

### Test Unitario Actualizado
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent] // ✅ imports para standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when button is pressed', () => {
    // ✅ Spy en el output signal
    spyOn(component.clicked, 'emit');
    
    // ✅ Usar fixture.componentRef.setInput para signals
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit when disabled', () => {
    spyOn(component.clicked, 'emit');
    
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.clicked.emit).not.toHaveBeenCalled();
  });
});
```

## 🔧 Herramientas de Desarrollo

### VS Code Snippets Actualizados
```json
{
  "Angular Modern Component": {
    "prefix": "ng-component-modern",
    "body": [
      "import { Component, computed, input, output } from '@angular/core';",
      "import { CommonModule } from '@angular/common';",
      "",
      "/**",
      " * $2",
      " * @example",
      " * <$1 prop=\"value\" (action)=\"handleAction()\">Content</$1>",
      " */",
      "@Component({",
      "  selector: '$1',",
      "  standalone: true,",
      "  imports: [CommonModule],",
      "  templateUrl: './$3.html',",
      "  styleUrls: ['./$3.css']",
      "})",
      "export class $4Component {",
      "  readonly prop = input<string>('');",
      "  readonly action = output<void>();",
      "  ",
      "  protected readonly cssClasses = computed(() => `$1`);",
      "  ",
      "  protected handleAction(): void {",
      "    this.action.emit();",
      "  }",
      "}"
    ],
    "description": "Crea un componente Angular moderno con signals"
  }
}
```

### ESLint Rules para Signals
```json
{
  "@angular-eslint/prefer-readonly": "error",
  "@angular-eslint/prefer-signal-inputs": "error",
  "@angular-eslint/prefer-signal-outputs": "error",
  "@typescript-eslint/member-ordering": [
    "error",
    {
      "default": [
        "readonly-field",
        "protected-field",
        "private-field",
        "constructor", 
        "protected-method",
        "private-method"
      ]
    }
  ]
}
```

## � Migración de Nomenclatura de Archivos

### 📋 Pasos para Renombrar Componentes Existentes

```bash
# 1. Renombrar archivos (mantener funcionalidad)
mv button.component.ts button.ts
mv button.component.html button.html  
mv button.component.css button.css
mv button.component.spec.ts button.spec.ts

# 2. Actualizar imports en otros archivos
# Buscar: import { ButtonComponent } from './button.component'
# Reemplazar: import { ButtonComponent } from './button'

# 3. Actualizar referencias en @Component decorator
# templateUrl: './button.component.html' → './button.html'
# styleUrls: ['./button.component.css'] → ['./button.css']
```

### ⚠️ Consideraciones de Migración
- **Tests**: Actualizar imports en archivos `.spec.ts`
- **Lazy Loading**: Verificar rutas en `loadComponent()`
- **Barrel Exports**: Actualizar archivos `index.ts`
- **IDE**: Puede requerir restart para actualizar referencias

## �📚 Checklist de Modernización

### ✅ Por Componente  
- [ ] **Renombrar archivos**: eliminar sufijo `.component`
- [ ] **Actualizar @Component paths**: templateUrl y styleUrls
- [ ] **Actualizar imports**: en tests y otros componentes
- [ ] Convertir `@Input()` a `input<T>()`
- [ ] Convertir `@Output()` a `output<T>()`
- [ ] Agregar `readonly` a inputs/outputs
- [ ] Cambiar métodos de template a `protected`
- [ ] Usar `computed()` para valores derivados
- [ ] Actualizar template para usar signals con `()`
- [ ] Reemplazar `ngClass`/`ngStyle` por `[class]`/`[style]`
- [ ] Agregar JSDoc con ejemplos
- [ ] Actualizar tests para signals
- [ ] Verificar accesibilidad (ARIA labels, etc.)

### 🎯 Beneficios Obtenidos
- ⚡ **Mejor Performance**: Signals optimizan change detection
- 🔒 **Mejor Encapsulación**: `protected`/`readonly` mejoran la API
- 📝 **Mejor DX**: Type inference mejorado con signals
- 🧪 **Mejor Testing**: APIs más predecibles para tests
- 📖 **Mejor Legibilidad**: Código más expresivo y claro

---

**Próximos pasos**: Aplicar estos patrones gradualmente a todos los componentes del design system, empezando por los atoms más utilizados.