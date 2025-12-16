# 🚀 Atomic Design

> Sistema de administración Angular basado en **Atomic Design** con componentes standalone y arquitectura modular.

## 📋 Descripción del Proyecto

Atomic Design es una aplicación de administración construida con Angular 18+ que implementa un sistema de diseño escalable basado en la metodología **Atomic Design**. El proyecto está optimizado para el desarrollo colaborativo con convenciones claras y herramientas de desarrollo modernas.

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/app/
├── components/              # Sistema de componentes Atomic Design
│   ├── atoms/              # Componentes básicos (button, input, label)
│   ├── molecules/          # Combinaciones de atoms (form-field, search-box)
│   ├── organisms/          # Componentes complejos (header, sidebar)
│   └── templates/          # Layouts de página
├── pages/                  # Páginas de la aplicación
│   ├── design-system-guide/ # Guía interactiva del sistema de diseño
│   └── dashboard/          # Página principal (ejemplo)
└── shared/                 # Servicios, interfaces y utilidades
    ├── services/           # Servicios de Angular
    ├── interfaces/         # Definiciones TypeScript
    └── utils/              # Funciones de utilidad
```

### Metodología Atomic Design
- **Atoms**: Elementos básicos e indivisibles
- **Molecules**: Combinaciones simples de atoms
- **Organisms**: Componentes complejos
- **Templates**: Layouts sin contenido específico
- **Pages**: Instancias específicas con contenido real

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 18+

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd ng-atomic-ui

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### Acceso a la Aplicación
```bash
# Servidor de desarrollo
http://localhost:4200

# Guía del Sistema de Diseño
http://localhost:4200/design-system-guide
```

## 🎨 Sistema de Diseño

### Guía Interactiva
Visita `/design-system-guide` para explorar:
- Documentación de Atomic Design
- Ejemplos de componentes
- Paleta de colores estándar
- Guías de uso y mejores prácticas

### Componentes Implementados
- ✅ **Button** (Atom) - Botón reutilizable con variantes
- ✅ **FormField** (Molecule) - Campo de formulario completo
- 🚧 **Header** (Organism) - En desarrollo
- 🚧 **Sidebar** (Organism) - En desarrollo

### Paleta de Colores
```css
--primary: #3b82f6    /* Main blue */
--secondary: #6b7280  /* Secondary gray */
--success: #10b981    /* Success green */
--danger: #ef4444     /* Danger red */
--warning: #f59e0b    /* Warning yellow */
```

## 🔧 Comandos de Desarrollo

### Desarrollo
```bash
npm start              # Servidor de desarrollo
npm run build          # Build de producción
npm run build:dev      # Build de desarrollo
```

### Testing
```bash
npm test               # Tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Coverage report
npm run e2e            # Tests end-to-end
```

### Calidad de Código
```bash
npm run lint           # ESLint
npm run lint:fix       # Fix automático de ESLint
npm run format         # Prettier
```

### Generación de Código
```bash
# Generar componente atom
ng generate component components/atoms/mi-atom --standalone

# Generar página
ng generate component pages/mi-pagina --standalone

# Generar servicio
ng generate service shared/services/mi-servicio
```

## 📚 Guías de Desarrollo

### Documentación Principal
- [**Copilot Instructions**](.github/copilot-instructions.md) - Instrucciones completas para desarrollo con IA
- [**Component Development Guide**](.github/component-development-guide.md) - Guía detallada para crear componentes
- [**Routing & Navigation Guide**](.github/routing-navigation-guide.md) - Patrones de navegación y rutas

### Convenciones
- **Nomenclatura**: kebab-case para archivos, PascalCase para clases
- **Componentes**: Siempre standalone con imports explícitos
- **Estilos**: CSS con variables custom properties
- **Testing**: Mínimo 80% de cobertura

### Flujo de Desarrollo
1. **Planificar**: Determinar nivel Atomic (Atom/Molecule/Organism)
2. **Crear**: Seguir estructura estándar de componentes
3. **Implementar**: TypeScript + HTML + CSS + Tests
4. **Documentar**: JSDoc + README si es necesario
5. **Exportar**: Actualizar index.ts correspondiente

## 🎯 Objetivos del Proyecto

### Desarrollo
- ✅ Estructura Atomic Design implementada
- ✅ Componentes standalone configurados
- ✅ Guía interactiva del sistema de diseño
- ✅ Lazy loading y code splitting
- 🚧 Testing automatizado completo
- 🚧 CI/CD pipeline
- 🚧 Storybook integration

### Diseño
- ✅ Sistema de colores definido
- ✅ Variables CSS estandarizadas
- ✅ Responsive design base
- 🚧 Tema oscuro/claro
- 🚧 Animaciones y transiciones
- 🚧 Iconografía consistente

## 🔗 Enlaces Útiles

### Desarrollo
- [Angular Documentation](https://angular.dev)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com)
- [Angular Coding Style Guide](https://angular.dev/style-guide)

### Herramientas
- [VS Code Extensions](.vscode/extensions.json)
- [Angular DevTools](https://angular.dev/tools/devtools)
- [Angular Language Service](https://angular.dev/tools/language-service)

## 🤝 Contribución

### Proceso
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Seguir guías de desarrollo
4. Commit con conventional commits
5. Push y crear Pull Request

### Estándares
- Seguir [Conventional Commits](https://www.conventionalcommits.org/)
- Tests obligatorios para nuevas funcionalidades
- Review de código requerido
- Documentación actualizada

## 📊 Métricas de Calidad

### Criterios de Aceptación
- [ ] Funciona en Chrome, Firefox, Safari, Edge
- [ ] Responsive en móvil, tablet, desktop
- [ ] Accesibilidad WCAG 2.1 AA
- [ ] Performance > 90 en Lighthouse
- [ ] Tests con coverage > 80%
- [ ] ESLint sin errores

### Monitoring
- Bundle size tracking
- Performance monitoring
- Error logging
- User analytics

## 📝 Changelog

### v0.1.0 (Actual)
- ✅ Estructura inicial Atomic Design
- ✅ Componentes Button y FormField
- ✅ Página guía del sistema de diseño
- ✅ Configuración de rutas con lazy loading
- ✅ Documentación completa del proyecto

### Próximas versiones
- v0.2.0: Componentes Organisms (Header, Sidebar)
- v0.3.0: Sistema de temas y modo oscuro
- v0.4.0: Autenticación y autorización
- v0.5.0: Dashboard funcional completo

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

> **Nota**: Para más detalles sobre el desarrollo y mantenimiento del proyecto, consulta las guías en la carpeta `.github/`.
