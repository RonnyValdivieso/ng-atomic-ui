# Copilot Prompt Instructions for ng-atomic-admin

## 📋 Descripción del Proyecto
Este es un proyecto de administración Angular que implementa un sistema de diseño basado en **Atomic Design**. El proyecto está configurado como una Single Page Application (SPA) con componentes standalone y arquitectura modular.

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/app/
├── components/           # Sistema de componentes Atomic Design
│   ├── atoms/           # Componentes básicos e indivisibles
│   ├── molecules/       # Combinaciones simples de atoms
│   ├── organisms/       # Componentes complejos
│   └── templates/       # Layouts de página
├── pages/              # Páginas de la aplicación
├── shared/             # Servicios, interfaces y utilidades
│   ├── services/       # Servicios de Angular
│   ├── interfaces/     # Definiciones TypeScript
│   └── utils/          # Funciones de utilidad
└── [archivos raíz]     # app.ts, app.routes.ts, etc.
```

## 🎨 Sistema de Diseño - Atomic Design

### Niveles Jerárquicos
1. **Atoms** (`/components/atoms/`)
   - Elementos básicos: botones, inputs, labels, iconos
   - No dependen de otros componentes
   - Máxima reutilización

2. **Molecules** (`/components/molecules/`)
   - Combinaciones de atoms: form-field, search-box
   - Solo pueden usar atoms
   - Funcionalidad específica

3. **Organisms** (`/components/organisms/`)
   - Componentes complejos: header, sidebar, navigation
   - Pueden usar molecules y atoms
   - Secciones distintivas de UI

4. **Templates** (`/components/templates/`)
   - Layouts de página sin contenido específico
   - Definen estructura y grid
   - Pueden usar todos los niveles anteriores

5. **Pages** (`/pages/`)
   - Instancias específicas con contenido real
   - Pueden usar todos los componentes

### Flujo de Dependencias
```
Pages ← Templates ← Organisms ← Molecules ← Atoms
```

## 🔧 Convenciones de Desarrollo

### Nomenclatura
- **Archivos y carpetas**: `kebab-case`
- **Componentes**: `PascalCase` + `Component` suffix
- **Interfaces**: `PascalCase` + descriptivo
- **Servicios**: `PascalCase` + `Service` suffix
- **Tipos**: `PascalCase` + `Type` suffix

### Estructura de Componentes (Angular Style Guide Oficial)
Cada componente debe incluir:
```
component-name/
├── component-name.ts               # Component class (NUEVO)
├── component-name.html             # Template HTML  
├── component-name.css              # Estilos específicos
├── component-name.spec.ts          # Tests unitarios
└── index.ts                        # Barrel export
```

**Nota**: Siguiendo la guía oficial de Angular, eliminamos el sufijo `.component` de los nombres de archivo para mayor simplicidad y claridad.

### Configuración de Componentes
- **Usar componentes standalone**: `standalone: true`
- **Importar dependencias**: En el array `imports`
- **Selector consistente**: `app-[nivel]-[nombre]`
  - Ejemplo: `app-button`, `app-form-field`

## 🎯 Reglas de Implementación

### 1. Componentes Atoms
```typescript
// Ejemplo de estructura para atoms
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly disabled = input<boolean>(false);
  readonly clicked = output<void>();
}
```

### 2. Gestión de Estado
- **Señales (Signals)**: Para estado reactivo
- **Servicios**: Para lógica de negocio y estado compartido
- **Input/Output**: Para comunicación entre componentes

### 3. Estilos CSS
- **Variables CSS**: Usar custom properties para temas
- **BEM-like**: Nomenclatura de clases descriptiva
- **Scoped**: Estilos específicos por componente
- **Responsive**: Mobile-first approach

### Paleta de Colores Estándar
```css
--primary: #3b82f6;
--secondary: #6b7280;
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
--info: #0ea5e9;
```

## 📝 Patrones de Código

### TypeScript
- **Strict mode**: Habilitado
- **Interfaces**: Para definir contratos
- **Tipos union**: Para props limitadas
- **Generics**: Cuando sea apropiado

### Angular
- **Lazy loading**: Para páginas
- **OnPush**: Change detection cuando sea posible
- **Reactive Forms**: Para formularios complejos
- **Template-driven**: Para formularios simples
- **Servicios inyectables**: Para lógica compartida

### Ejemplo de Servicio
```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = 'api/v1';
  
  constructor(private http: HttpClient) {}
  
  getData(): Observable<DataType[]> {
    return this.http.get<DataType[]>(`${this.apiUrl}/data`);
  }
}
```

## 🧪 Testing

### Estructura de Tests
- **Unitarios**: Para cada componente y servicio
- **Integración**: Para flujos completos
- **Coverage mínimo**: 80%

### Convenciones de Testing
```typescript
describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();
  });

  it('should emit clicked event when clicked', () => {
    // Test implementation
  });
});
```

## 📚 Documentación

### README por Nivel
- Cada carpeta de nivel debe tener README.md explicativo
- Documentar propiedades y eventos de componentes
- Incluir ejemplos de uso

### Comentarios JSDoc
```typescript
/**
 * Botón reutilizable con diferentes variantes y estados
 * @example
 * <app-button variant="primary" size="medium" (clicked)="handleClick()">
 *   Guardar
 * </app-button>
 */
@Component({...})
export class ButtonComponent {
  /** Variante visual del botón */
  @Input() variant: ButtonVariant = 'primary';
}
```

## 🚀 Performance

### Optimizaciones
- **OnPush**: Para componentes de presentación
- **TrackBy**: En *ngFor loops
- **Lazy loading**: Para rutas
- **Preload strategies**: Para módulos críticos

### Bundle Size
- **Tree shaking**: Eliminar código no usado
- **Code splitting**: Por rutas
- **Barrel exports**: Para mejor organización

## 🔄 Flujo de Desarrollo

### 1. Creación de Nuevos Componentes
1. Determinar el nivel Atomic (atom, molecule, etc.)
2. Crear estructura de carpetas estándar
3. Implementar componente con TypeScript strict
4. Agregar estilos con variables CSS
5. Escribir tests unitarios
6. Documentar en README local
7. Exportar en index.ts correspondiente

### 2. Modificación de Componentes Existentes
1. Verificar impacto en dependencias
2. Mantener backward compatibility
3. Actualizar tests
4. Actualizar documentación

### 3. Nuevas Páginas
1. Crear en `/pages/` siguiendo convenciones
2. Configurar ruta en `app.routes.ts`
3. Usar lazy loading
4. Componer con componentes existentes

## 🎛️ Configuración de Herramientas

### ESLint/Prettier
- Seguir configuración establecida
- Auto-format on save
- Strict TypeScript rules

### Git Hooks
- Pre-commit: Lint y format
- Pre-push: Tests unitarios
- Conventional commits

## 📦 Dependencias

### Core Dependencies
- Angular 18+ (standalone components)
- TypeScript 5+
- RxJS para reactive programming

### Development Dependencies
- Jest o Jasmine para testing
- ESLint + Prettier para code quality
- Husky para git hooks

## 🐛 Debugging y Troubleshooting

### Errores Comunes
1. **Import errors**: Verificar exports en index.ts
2. **Template errors**: Asegurar imports en standalone components
3. **Style conflicts**: Usar scoped styles
4. **Performance issues**: Implementar OnPush strategy

### Tools de Desarrollo
- Angular DevTools para debugging
- Chrome DevTools para performance
- VS Code extensions recomendadas

## 📈 Métricas de Calidad

### Criterios de Aceptación
- [ ] Componente funciona en diferentes viewports
- [ ] Accesibilidad (WCAG 2.1 AA)
- [ ] Tests unitarios pasan
- [ ] ESLint sin errores
- [ ] Documentación actualizada
- [ ] Performance impact evaluado

### Code Review Checklist
- [ ] Sigue patrones Atomic Design
- [ ] Nomenclatura consistente
- [ ] TypeScript strict compliant
- [ ] Estilos responsive
- [ ] Tests adequados
- [ ] Documentación clara

---

## 🎯 Objetivos de Consistencia

Estas instrucciones aseguran que:
1. **Código escalable** y mantenible
2. **Diseño consistente** en toda la aplicación  
3. **Performance optimizada** desde el inicio
4. **Colaboración efectiva** entre desarrolladores
5. **Calidad de código** uniforme

**Recuerda**: Siempre priorizar la experiencia del usuario y la mantenibilidad del código a largo plazo.

