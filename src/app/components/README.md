# Atomic Design Structure

Esta estructura sigue la metodología de Atomic Design propuesta por Brad Frost, que organiza los componentes de UI en cinco categorías distintas:

## 📦 Estructura de Carpetas

```
src/app/
├── components/
│   ├── atoms/          # Componentes básicos e indivisibles
│   ├── molecules/      # Combinaciones simples de atoms
│   ├── organisms/      # Combinaciones complejas de molecules y atoms
│   └── templates/      # Layouts de página sin contenido específico
├── pages/              # Instancias específicas de templates con contenido real
└── shared/             # Servicios, interfaces y utilidades compartidas
```

## 🔬 Niveles de Atomic Design

### 1. **Atoms** (`/components/atoms/`)
Los bloques de construcción más básicos de la interfaz. Son elementos HTML que no se pueden dividir más sin perder su funcionalidad.

**Ejemplos:**
- `button/` - Botones
- `input/` - Campos de entrada
- `label/` - Etiquetas
- `icon/` - Iconos
- `text/` - Elementos de texto

### 2. **Molecules** (`/components/molecules/`)
Grupos simples de elementos de UI que funcionan juntos como una unidad. Son combinaciones de atoms que tienen una función específica.

**Ejemplos:**
- `search-box/` - Caja de búsqueda (input + button)
- `form-field/` - Campo de formulario (label + input + validation)
- `card-header/` - Encabezado de tarjeta
- `navigation-item/` - Elemento de navegación

### 3. **Organisms** (`/components/organisms/`)
Componentes complejos compuestos por grupos de molecules y/o atoms. Forman secciones distintivas de una interfaz.

**Ejemplos:**
- `header/` - Cabecera del sitio
- `sidebar/` - Barra lateral de navegación
- `product-grid/` - Grilla de productos
- `contact-form/` - Formulario de contacto completo

### 4. **Templates** (`/components/templates/`)
Componentes a nivel de página que colocan organisms en un layout. Definen la estructura subyacente del contenido pero no incluyen contenido específico.

**Ejemplos:**
- `main-layout/` - Layout principal de la aplicación
- `auth-layout/` - Layout para páginas de autenticación
- `dashboard-layout/` - Layout del dashboard

### 5. **Pages** (`/pages/`)
Instancias específicas de templates con contenido real y representativo. Aquí es donde se combinan todos los niveles anteriores.

**Ejemplos:**
- `dashboard/` - Página del dashboard
- `login/` - Página de inicio de sesión
- `profile/` - Página de perfil de usuario

## 📋 Convenciones de Nomenclatura

- Usa **kebab-case** para nombres de carpetas y archivos
- Cada componente debe tener su propia carpeta con:
  - `component-name.component.ts`
  - `component-name.component.html`
  - `component-name.component.css`
  - `component-name.component.spec.ts`
  - `index.ts` (para exportaciones)

## 🔄 Flujo de Dependencias

```
Pages ← Templates ← Organisms ← Molecules ← Atoms
```

- **Atoms** no dependen de ningún otro componente
- **Molecules** solo pueden usar Atoms
- **Organisms** pueden usar Molecules y Atoms
- **Templates** pueden usar Organisms, Molecules y Atoms
- **Pages** pueden usar todos los niveles anteriores

## 📁 Carpeta Shared

La carpeta `shared/` contiene elementos transversales a la aplicación:

- `services/` - Servicios de Angular
- `interfaces/` - Definiciones de tipos e interfaces TypeScript
- `utils/` - Funciones de utilidad
- `constants/` - Constantes de la aplicación
- `guards/` - Guards de Angular
- `interceptors/` - Interceptors HTTP

## 🚀 Beneficios

1. **Reutilización**: Los componentes más pequeños pueden reutilizarse en múltiples contextos
2. **Mantenimiento**: Cambios en atoms se propagan automáticamente
3. **Testing**: Cada nivel puede probarse de forma independiente
4. **Escalabilidad**: Estructura clara para equipos grandes
5. **Consistencia**: Design system cohesivo y predecible