# Guía de Desarrollo de Componentes - ng-atomic-admin

## 🎯 Checklist para Crear Componentes

### Antes de Empezar
- [ ] Determinar el nivel Atomic correcto (Atom, Molecule, Organism, Template)
- [ ] Verificar si ya existe un componente similar
- [ ] Definir las props y eventos necesarios
- [ ] Revisar la guía de diseño en `/design-system-guide`

### Proceso de Creación

#### 1. Estructura de Archivos
```bash
# Ejemplo para un nuevo atom
src/app/components/atoms/nueva-funcionalidad/
├── nueva-funcionalidad.component.ts
├── nueva-funcionalidad.component.html  
├── nueva-funcionalidad.component.css
├── nueva-funcionalidad.component.spec.ts
└── index.ts
```

#### 2. Template del Componente TypeScript
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MiTipo = 'opcion1' | 'opcion2' | 'opcion3';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  @Input() propiedad: string = '';
  @Input() tipo: MiTipo = 'opcion1';
  @Input() disabled: boolean = false;
  
  @Output() eventoPersonalizado = new EventEmitter<any>();

  manejarEvento(): void {
    if (!this.disabled) {
      this.eventoPersonalizado.emit(/* datos */);
    }
  }

  get clasesCSS(): string {
    return [
      'mi-componente',
      `mi-componente--${this.tipo}`,
      this.disabled ? 'mi-componente--disabled' : ''
    ].filter(Boolean).join(' ');
  }
}
```

#### 3. Template HTML
```html
<div [class]="clasesCSS">
  <ng-content></ng-content>
  <!-- Contenido del componente -->
</div>
```

#### 4. Estilos CSS
```css
/* Base del componente */
.mi-componente {
  display: block;
  /* Estilos base */
}

/* Variantes */
.mi-componente--opcion1 {
  /* Estilos para opcion1 */
}

.mi-componente--opcion2 {
  /* Estilos para opcion2 */
}

/* Estados */
.mi-componente--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .mi-componente {
    /* Estilos mobile */
  }
}
```

#### 5. Test Unitario
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponenteComponent } from './mi-componente.component';

describe('MiComponenteComponent', () => {
  let component: MiComponenteComponent;
  let fixture: ComponentFixture<MiComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponenteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when action is triggered', () => {
    spyOn(component.eventoPersonalizado, 'emit');
    
    component.manejarEvento();
    
    expect(component.eventoPersonalizado.emit).toHaveBeenCalled();
  });

  it('should not emit event when disabled', () => {
    spyOn(component.eventoPersonalizado, 'emit');
    component.disabled = true;
    
    component.manejarEvento();
    
    expect(component.eventoPersonalizado.emit).not.toHaveBeenCalled();
  });
});
```

#### 6. Index.ts (Barrel Export)
```typescript
export * from './mi-componente.component';
```

#### 7. Actualizar Index del Nivel
```typescript
// En src/app/components/atoms/index.ts (por ejemplo)
export * from './mi-componente';
export * from './otro-componente';
```

## 🎨 Guías de Diseño

### Variables CSS Estándar
```css
:root {
  /* Colores */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Tipografía */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Breakpoints Responsive
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## 🧩 Patrones de Composición

### Atoms (Ejemplos)
- `app-button`
- `app-input`
- `app-label`
- `app-icon`
- `app-avatar`
- `app-badge`

### Molecules (Ejemplos)
- `app-form-field` (label + input + validation)
- `app-search-box` (input + button)
- `app-card-header` (title + actions)
- `app-pagination-item`

### Organisms (Ejemplos)
- `app-header` (navigation + user menu)
- `app-sidebar` (navigation items)
- `app-data-table` (header + rows + pagination)
- `app-form-section`

### Templates (Ejemplos)
- `app-main-layout` (header + sidebar + content)
- `app-auth-layout` (centered form)
- `app-dashboard-layout` (grid layout)

## 🔧 Herramientas de Desarrollo

### Comandos Útiles
```bash
# Generar nuevo componente
ng generate component components/atoms/mi-componente --standalone

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Lint del código
npm run lint

# Build de producción
npm run build
```

### VS Code Extensions Recomendadas
- Angular Language Service
- Angular Snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- ESLint
- Prettier
- GitLens

### Snippets Útiles
```json
{
  "Angular Standalone Component": {
    "prefix": "ng-component",
    "body": [
      "import { Component, Input, Output, EventEmitter } from '@angular/core';",
      "import { CommonModule } from '@angular/common';",
      "",
      "@Component({",
      "  selector: 'app-${1:component-name}',",
      "  standalone: true,",
      "  imports: [CommonModule],",
      "  templateUrl: './${1:component-name}.component.html',",
      "  styleUrls: ['./${1:component-name}.component.css']",
      "})",
      "export class ${2:ComponentName}Component {",
      "  @Input() ${3:property}: ${4:string} = ${5:''};",
      "  @Output() ${6:event} = new EventEmitter<${7:void}>();",
      "",
      "  ${8:method}(): void {",
      "    this.${6:event}.emit();",
      "  }",
      "}"
    ]
  }
}
```

## 📋 Review Checklist

### Funcionalidad
- [ ] El componente funciona según los requisitos
- [ ] Maneja casos edge correctamente
- [ ] Props opcionales tienen valores por defecto
- [ ] Eventos se emiten correctamente

### Código
- [ ] TypeScript strict sin errores
- [ ] ESLint sin warnings
- [ ] Nombres descriptivos y consistentes
- [ ] Lógica simple y comprensible

### Estilos
- [ ] Responsive en diferentes dispositivos
- [ ] Usa variables CSS estándar
- [ ] Clases BEM-like consistentes
- [ ] Estados de hover/focus/disabled

### Testing
- [ ] Tests unitarios pasan
- [ ] Coverage mínimo del 80%
- [ ] Casos edge cubiertos
- [ ] Mocks apropiados

### Documentación
- [ ] JSDoc en métodos públicos
- [ ] README actualizado si es necesario
- [ ] Ejemplos de uso claros
- [ ] Props documentadas

### Accesibilidad
- [ ] Elementos semánticos apropiados
- [ ] Labels para form elements
- [ ] Contraste de colores adecuado
- [ ] Navegación por teclado

### Performance
- [ ] OnPush strategy considerada
- [ ] TrackBy en loops si aplica
- [ ] Lazy loading si es apropiado
- [ ] Bundle size impact evaluado

## 🚨 Antipatrones a Evitar

### ❌ No Hacer
```typescript
// Lógica compleja en el template
{{ complexCalculation() }}

// Mutación directa de props
this.inputArray.push(newItem);

// Suscripciones sin unsubscribe
this.service.getData().subscribe(...);

// Estilos inline
<div style="color: red;">
```

### ✅ Mejor Práctica
```typescript
// Computed properties
get computedValue() { return this.calculate(); }

// Inmutabilidad
this.inputArray = [...this.inputArray, newItem];

// Manejo de suscripciones
private destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); }

// Clases CSS
<div class="text-danger">
```

---

Esta guía debe seguirse para mantener consistencia y calidad en el desarrollo de componentes del sistema de diseño.