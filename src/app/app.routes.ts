import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'design-system-guide',
    loadComponent: () => 
      import('./pages/design-system-guide/design-system-guide')
        .then(m => m.DesignSystemGuideComponent)
  },
  {
    path: 'layout-demo',
    loadComponent: () => 
      import('./pages/layout-demo/layout-demo')
        .then(m => m.LayoutDemoComponent)
  },
  {
    path: '',
    redirectTo: '/layout-demo',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/layout-demo'
  }
];
