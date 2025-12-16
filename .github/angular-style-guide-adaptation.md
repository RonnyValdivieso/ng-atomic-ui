# Adaptación de la Nueva Guía de Estilos Angular para Atomic Design

## 🎯 Objetivo
Este documento adapta las recomendaciones oficiales de Angular (https://angular.dev/style-guide) para nuestro proyecto que implementa Atomic Design, manteniendo lo mejor de ambos enfoques.

## 🏗️ Arquitectura Híbrida Propuesta

### 📁 Estructura de Carpetas - Hybrid Approach
```
src/app/
├── components/              # Design System (Atomic Design)
│   ├── atoms/              # Elementos básicos del design system
│   ├── molecules/          # Combinaciones simples
│   ├── organisms/          # Componentes complejos
│   └── templates/          # Layouts
├── features/               # Organización por funcionalidad (Nueva guía)
│   ├── auth/              # Feature: Autenticación
│   │   ├── login/         # Página específica
│   │   ├── register/      # Página específica
│   │   └── shared/        # Servicios/utils del feature
│   ├── dashboard/         # Feature: Dashboard
│   ├── user-management/   # Feature: Gestión de usuarios
│   └── reports/           # Feature: Reportes
├── shared/                # Código compartido global
│   ├── services/          # Servicios globales
│   ├── interfaces/        # Tipos globales
│   ├── utils/             # Utilidades globales
│   └── guards/            # Guards de navegación
└── pages/                 # Páginas principales (mantener para simplicidad)
```

### 🎨 Filosofía de Organización

#### Design System vs Features
- **`/components/`**: Para el **design system reutilizable** - Atomic Design
- **`/features/`**: Para **lógica de negocio** - Organización por funcionalidad
- **`/pages/`**: Para **páginas principales** que combinan features y components

## 📝 Nuevas Convenciones de Código

### 1. 🔧 Inyección de Dependencias - Nueva Sintaxis
```typescript
// ✅ PREFERIR - inject() function (Nueva guía)
import { inject } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  // ...
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  
  // Mejor legibilidad y type inference
}

// ❌ EVITAR - Constructor injection
export class UserListComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}
}
```

### 2. 🔒 Propiedades de Clase - Visibilidad y Mutabilidad
```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClasses()" 
      [disabled]="isDisabled()"
      (click)="handleClick()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  // ✅ readonly para inputs (nueva guía)
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input<boolean>(false);
  
  // ✅ readonly para outputs
  readonly clicked = output<void>();
  
  // ✅ protected para métodos usados solo en template
  protected readonly buttonClasses = computed(() => 
    `btn btn--${this.variant()} btn--${this.size()}`
  );
  
  protected readonly isDisabled = computed(() => this.disabled());
  
  // ✅ protected para event handlers
  protected handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

### 3. 🎨 Templates - Nuevas Mejores Prácticas
```html
<!-- ✅ PREFERIR - class/style binding directo -->
<div [class.active]="isActive()" 
     [class.disabled]="isDisabled()"
     [style.opacity]="opacity()">
     
<!-- ✅ PREFERIR - class object binding -->
<div [class]="{
  'btn': true,
  'btn--primary': variant() === 'primary',
  'btn--large': size() === 'large'
}">

<!-- ❌ EVITAR - ngClass/ngStyle -->
<div [ngClass]="{active: isActive(), disabled: isDisabled()}">
```

### 4. 📝 Event Handlers - Nombres Descriptivos
```typescript
// ✅ PREFERIR - Nombres por acción
protected saveUserProfile(): void { }
protected deleteSelectedItem(): void { }
protected toggleSidebar(): void { }
protected submitForm(): void { }

// ❌ EVITAR - Nombres por evento
protected handleClick(): void { }
protected onButtonPress(): void { }
protected clickHandler(): void { }
```

### 5. 🔄 Lifecycle Hooks - Métodos Simples
```typescript
export class UserProfileComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.initializeUserData();
    this.startAutoSave();
    this.configureFormValidation();
  }
  
  // ✅ Lógica extraída a métodos con nombres descriptivos
  private initializeUserData(): void {
    // Lógica específica de inicialización
  }
  
  private startAutoSave(): void {
    // Lógica de auto-guardado
  }
  
  private configureFormValidation(): void {
    // Configuración de validaciones
  }
}
```

## 🎯 Nomenclatura Actualizada

### Archivos y Carpetas
```
// ✅ Componentes del Design System
button.component.ts
form-field.component.ts
user-profile-card.component.ts

// ✅ Features por funcionalidad
user-management/
  user-list.component.ts
  user-detail.component.ts
  user-edit-form.component.ts
  
auth/
  login-form.component.ts
  password-reset.component.ts
```

### Selectores de Componentes
```typescript
// ✅ Design System Components - prefijo genérico
selector: 'app-button'
selector: 'app-form-field' 
selector: 'app-card'

// ✅ Feature Components - prefijo + feature
selector: 'app-user-list'
selector: 'app-auth-login'
selector: 'app-dashboard-stats'
```

## 🔄 Plan de Migración

### Fase 1: Actualizar Componentes Existentes
1. ✅ Migrar de constructor a `inject()` function
2. ✅ Agregar `readonly` a inputs/outputs
3. ✅ Cambiar métodos de template a `protected`
4. ✅ Actualizar event handlers con nombres descriptivos
5. ✅ Reemplazar ngClass/ngStyle por class/style binding

### Fase 2: Reorganizar por Features
1. 📁 Crear estructura `/features/`
2. 🔄 Mover páginas complejas a features
3. 🔗 Mantener `/components/` para design system
4. 📚 Actualizar documentación

### Fase 3: Optimización
1. ⚡ Implementar OnPush strategy donde sea apropiado
2. 🧪 Actualizar tests siguiendo nuevas convenciones
3. 📋 Crear templates/generators para nuevos componentes

## 🛠️ Herramientas de Desarrollo

### ESLint Rules Actualizadas
```json
{
  "@angular-eslint/prefer-readonly": "error",
  "@angular-eslint/use-injectable-provided-in": "error",
  "@angular-eslint/prefer-standalone": "error"
}
```

### VS Code Snippets
```json
{
  "Angular Standalone Component": {
    "prefix": "ng-standalone",
    "body": [
      "@Component({",
      "  selector: 'app-${1:name}',",
      "  standalone: true,",
      "  imports: [CommonModule],",
      "  templateUrl: './${1:name}.component.html',",
      "  styleUrls: ['./${1:name}.component.css']",
      "})",
      "export class ${2:Name}Component {",
      "  private readonly service = inject(${3:Service});",
      "  ",
      "  readonly input1 = input<${4:string}>();",
      "  readonly output1 = output<${5:void}>();",
      "  ",
      "  protected handleAction(): void {",
      "    // Implementation",
      "  }",
      "}"
    ]
  }
}
```

## 🎯 Beneficios de la Adaptación

### Mantiene Atomic Design
- ✅ Design system cohesivo y escalable
- ✅ Componentes reutilizables bien organizados
- ✅ Jerarquía clara de componentes

### Adopta Nuevas Mejores Prácticas
- ⚡ Mejor performance con OnPush strategy
- 🔒 Mejor encapsulación con `protected`/`readonly`
- 🎯 Mejor mantenibilidad con `inject()`
- 📝 Templates más legibles

### Organización Híbrida
- 🎨 `/components/` para design system
- 🏢 `/features/` para lógica de negocio
- 🌍 `/shared/` para código común

## 📚 Recursos Adicionales

- [Angular Style Guide Oficial](https://angular.dev/style-guide)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)

---

**Próximo Paso**: Implementar la migración gradual manteniendo la funcionalidad actual mientras adoptamos las nuevas mejores prácticas.