# Guía de Rutas y Navegación - ng-atomic-admin

## 🛣️ Estructura de Rutas

### Convenciones de Nomenclatura
- **Rutas en kebab-case**: `/design-system-guide`
- **Parámetros descriptivos**: `/user/:userId/profile`
- **Jerarquía clara**: `/admin/users/create`

### Configuración de Rutas
```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'design-system-guide',
    loadComponent: () => 
      import('./pages/design-system-guide/design-system-guide.component')
        .then(m => m.DesignSystemGuideComponent)
  },
  {
    path: 'users',
    loadChildren: () => 
      import('./features/users/users.routes')
        .then(m => m.userRoutes)
  },
  {
    path: '**',
    loadComponent: () => 
      import('./pages/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
```

### Lazy Loading Pattern
```typescript
// features/users/users.routes.ts
import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/user-list/user-list.component')
        .then(m => m.UserListComponent)
  },
  {
    path: 'create',
    loadComponent: () => 
      import('./pages/user-create/user-create.component')
        .then(m => m.UserCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/user-detail/user-detail.component')
        .then(m => m.UserDetailComponent)
  }
];
```

## 🧭 Navegación y Guards

### Estructura de Guards
```typescript
// shared/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

### Uso de Guards en Rutas
```typescript
{
  path: 'admin',
  canActivate: [authGuard],
  loadChildren: () => import('./admin/admin.routes')
}
```

## 🎯 Páginas y Componentes de Página

### Estructura de Página Estándar
```typescript
// pages/dashboard/dashboard.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/organisms/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = signal(false);
  data = signal<any[]>([]);
  
  ngOnInit(): void {
    this.loadData();
  }
  
  private async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      // Lógica de carga
    } finally {
      this.loading.set(false);
    }
  }
}
```

### Template de Página
```html
<!-- dashboard.component.html -->
<div class="page">
  <app-header [title]="'Dashboard'" />
  
  <main class="page__content">
    @if (loading()) {
      <div class="page__loading">
        Cargando...
      </div>
    } @else {
      <div class="page__data">
        <!-- Contenido de la página -->
      </div>
    }
  </main>
</div>
```

### Estilos de Página Base
```css
/* dashboard.component.css */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page__content {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.page__data {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .page__content {
    padding: var(--spacing-md);
  }
}
```

## 🔗 Navegación Programática

### Router Service
```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export class NavigationService {
  private router = inject(Router);
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
  navigateWithParams(path: string, params: any): void {
    this.router.navigate([path], { queryParams: params });
  }
  
  goBack(): void {
    window.history.back();
  }
}
```

### Uso en Componentes
```typescript
export class UserListComponent {
  private router = inject(Router);
  
  onUserSelect(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
  
  onCreateUser(): void {
    this.router.navigate(['/users/create']);
  }
}
```

## 📱 Layouts y Templates

### Main Layout Component
```typescript
// components/templates/main-layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout">
      <app-header class="layout__header" />
      <div class="layout__body">
        <app-sidebar class="layout__sidebar" />
        <main class="layout__content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {}
```

### Layout Styles
```css
.layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.layout__header {
  grid-column: 1 / -1;
  z-index: 100;
}

.layout__body {
  display: grid;
  grid-template-columns: 250px 1fr;
  overflow: hidden;
}

.layout__sidebar {
  background: var(--color-gray-50);
  border-right: 1px solid var(--color-gray-200);
  overflow-y: auto;
}

.layout__content {
  overflow-y: auto;
  padding: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .layout__body {
    grid-template-columns: 1fr;
  }
  
  .layout__sidebar {
    display: none;
  }
}
```

## 🎨 SEO y Meta Tags

### Meta Service
```typescript
// shared/services/meta.service.ts
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private meta = inject(Meta);
  private title = inject(Title);
  
  setPageMeta(config: {
    title: string;
    description: string;
    keywords?: string;
  }): void {
    this.title.setTitle(`${config.title} | Atomic Design`);
    
    this.meta.updateTag({ 
      name: 'description', 
      content: config.description 
    });
    
    if (config.keywords) {
      this.meta.updateTag({ 
        name: 'keywords', 
        content: config.keywords 
      });
    }
  }
}
```

### Uso en Páginas
```typescript
export class DashboardComponent implements OnInit {
  private metaService = inject(MetaService);
  
  ngOnInit(): void {
    this.metaService.setPageMeta({
      title: 'Dashboard',
      description: 'Panel de control administrativo',
      keywords: 'dashboard, admin, control'
    });
  }
}
```

## 🔐 Seguridad y Autorización

### Role-based Guard
```typescript
// shared/guards/role.guard.ts
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const userRole = authService.getCurrentUserRole();
    
    if (allowedRoles.includes(userRole)) {
      return true;
    }
    
    router.navigate(['/unauthorized']);
    return false;
  };
}
```

### Uso en Rutas
```typescript
{
  path: 'admin',
  canActivate: [roleGuard(['admin', 'superuser'])],
  loadChildren: () => import('./admin/admin.routes')
}
```

## 📊 Analytics y Tracking

### Route Tracking
```typescript
// shared/services/analytics.service.ts
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  
  init(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }
  
  private trackPageView(url: string): void {
    // Implementar tracking (Google Analytics, etc.)
    console.log('Page view:', url);
  }
}
```

## 🧪 Testing de Rutas

### Router Testing
```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({ template: '' })
class MockComponent { }

describe('Routing', () => {
  let router: Router;
  let location: Location;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'dashboard', component: MockComponent }
      ])]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });
  
  it('should navigate to dashboard', async () => {
    await router.navigate(['/dashboard']);
    expect(location.path()).toBe('/dashboard');
  });
});
```

## 📋 Checklist de Rutas

### Configuración
- [ ] Lazy loading implementado
- [ ] Guards apropiados configurados
- [ ] Redirects definidos
- [ ] Ruta 404 configurada

### SEO
- [ ] Títulos de página únicos
- [ ] Meta descriptions relevantes
- [ ] URLs amigables
- [ ] Breadcrumbs implementados

### Seguridad
- [ ] Rutas protegidas con guards
- [ ] Validación de roles
- [ ] Manejo de errores de autorización
- [ ] Redirección después del login

### Performance
- [ ] Code splitting por features
- [ ] Preload strategy configurada
- [ ] Bundle size optimizado
- [ ] Componentes reutilizados

### UX
- [ ] Estados de carga implementados
- [ ] Navegación intuitiva
- [ ] Breadcrumbs informativos
- [ ] Manejo de errores amigable

---

Esta guía asegura una navegación consistente y bien estructurada en toda la aplicación.