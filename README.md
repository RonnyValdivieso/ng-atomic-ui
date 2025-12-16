# 🚀 Atomic Design

> Angular Admin System based on **Atomic Design** with standalone components and modular architecture.

## 📋 Project Description

Atomic Design is an admin application built with Angular 18+ that implements a scalable design system based on the **Atomic Design** methodology. The project is optimized for collaborative development with clear conventions and modern developer tools.

## 🏗️ Project Architecture

### Folder Structure
```
src/app/
├── components/              # Atomic Design Component System
│   ├── atoms/               # Basic components (button, input, label)
│   ├── molecules/           # Atom combinations (form-field, search-box)
│   ├── organisms/           # Complex components (header, sidebar)
│   └── templates/           # Page layouts
├── pages/                   # Application Pages
│   ├── design-system-guide/ # Interactive design system guide
│   └── dashboard/           # Main page (example)
└── shared/                  # Services, interfaces, and utilities
    ├── services/            # Angular Services
    ├── interfaces/          # TypeScript Definitions
    └── utils/               # Utility functions
```

### Atomic Design Methodology
- **Atoms**: Basic and indivisible elements
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex components
- **Templates**: Layouts without specific content
- **Pages**: Specific instances with real content

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 18+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ng-atomic-ui

# Install dependencies
npm install

# Start development server
npm start
```

### Application Access
```bash
# Development Server
http://localhost:4200

# Design System Guide
http://localhost:4200/design-system-guide
```

## 🎨 Design System

### Interactive Guide
Visit `/design-system-guide` to explore:
- Atomic Design Documentation
- Component Examples
- Standard Color Palette
- Usage Guides and Best Practices

### Implemented Components
- ✅ **Button** (Atom) - Reusable button with variants
- ✅ **FormField** (Molecule) - Complete form field
- 🚧 **Header** (Organism) - In development
- 🚧 **Sidebar** (Organism) - In development

### Color Palette
```css
--primary: #3b82f6    /* Main blue */
--secondary: #6b7280  /* Secondary gray */
--success: #10b981    /* Success green */
--danger: #ef4444     /* Danger red */
--warning: #f59e0b    /* Warning yellow */
```

## 🔧 Development Commands

### Development
```bash
npm start              # Development server
npm run build          # Production build
npm run build:dev      # Development build
```

### Testing
```bash
npm test               # Unit tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Coverage report
npm run e2e            # End-to-end tests
```

### Code Quality
```bash
npm run lint           # ESLint
npm run lint:fix       # Automatic ESLint fix
npm run format         # Prettier
```

### Code Generation
```bash
# Generate atom component
ng generate component components/atoms/my-atom --standalone

# Generate page
ng generate component pages/my-page --standalone

# Generate service
ng generate service shared/services/my-service
```

## 📚 Development Guides

### Main Documentation
- [**Copilot Instructions**](.github/copilot-instructions.md) - Complete instructions for AI-assisted development
- [**Component Development Guide**](.github/component-development-guide.md) - Detailed guide for creating components
- [**Routing & Navigation Guide**](.github/routing-navigation-guide.md) - Navigation patterns and routing
- [**Tailwind Integration**](.github/TAILWIND-INTEGRATION.md) - Tailwind CSS setup and usage

### Conventions
- **Naming**: kebab-case for files, PascalCase for classes
- **Components**: Always standalone with explicit imports
- **Styles**: CSS with custom property variables
- **Testing**: Minimum 80% coverage

### Development Flow
1. **Plan**: Determine Atomic level (Atom/Molecule/Organism)
2. **Create**: Follow standard component structure
3. **Implement**: TypeScript + HTML + CSS + Tests
4. **Document**: JSDoc + README if necessary
5. **Export**: Update corresponding index.ts

## 🎯 Project Goals

### Development
- ✅ Atomic Design structure implemented
- ✅ Standalone components configured
- ✅ Interactive Design System Guide
- ✅ Lazy loading and code splitting
- 🚧 Complete automated testing
- 🚧 CI/CD pipeline
- 🚧 Storybook integration

### Design
- ✅ Color system defined
- ✅ Standardized CSS variables
- ✅ Base responsive design
- 🚧 Dark/Light theme
- 🚧 Animations and transitions
- 🚧 Consistent iconography

## 🔗 Useful Links

### Development
- [Angular Documentation](https://angular.dev)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com)
- [Angular Coding Style Guide](https://angular.dev/style-guide)

### Tools
- [VS Code Extensions](.vscode/extensions.json)
- [Angular DevTools](https://angular.dev/tools/devtools)
- [Angular Language Service](https://angular.dev/tools/language-service)

## 🤝 Contribution

### Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Follow development guides
4. Commit with specific conventional commits
5. Push and create Pull Request

### Standards
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Mandatory tests for new features
- Code review required
- Updated documentation

## 📊 Quality Metrics

### Acceptance Criteria
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility WCAG 2.1 AA
- [ ] Performance > 90 in Lighthouse
- [ ] Tests with coverage > 80%
- [ ] ESLint without errors

### Monitoring
- Bundle size tracking
- Performance monitoring
- Error logging
- User analytics



## 📄 License

This project is licensed under the [MIT](LICENSE) license.

---

> **Note**: For more details on project development and maintenance, consult the guides in the `.github/` folder.
