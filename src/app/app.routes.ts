import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { superAdminGuard } from './shared/guards/super-admin.guard';

export const routes: Routes = [
  {
    path: 'auth/sign-in',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'workspace-selector',
        loadComponent: () =>
          import('./pages/workspace-selector/workspace-selector')
            .then(m => m.WorkspaceSelectorComponent)
      },
      { path: '', redirectTo: 'workspace-selector', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, superAdminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout')
        .then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'workspaces', pathMatch: 'full' },
      {
        path: 'workspaces',
        loadComponent: () =>
          import('./pages/admin/workspaces/list/list')
            .then(m => m.AdminWorkspacesListComponent)
      },
      {
        path: 'organizations',
        loadComponent: () =>
          import('./pages/admin/organizations/list/list')
            .then(m => m.AdminOrganizationsListComponent)
      },
      {
        path: 'service-teams',
        loadComponent: () =>
          import('./pages/admin/service-teams/list/list')
            .then(m => m.AdminServiceTeamsListComponent)
      },
      {
        path: 'service-teams/:id',
        loadComponent: () =>
          import('./pages/admin/service-teams/details/details')
            .then(m => m.AdminServiceTeamDetailsComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/admin/roles/list/list')
            .then(m => m.AdminRolesListComponent)
      },
      {
        path: 'modules',
        loadComponent: () =>
          import('./pages/admin/modules/list/list')
            .then(m => m.AdminModulesListComponent)
      },
      {
        path: 'authentication-log',
        loadComponent: () =>
          import('./pages/admin/authentication-log/list/list')
            .then(m => m.AdminAuthenticationLogListComponent)
      },
      {
        path: 'platform',
        children: [
          { path: '', redirectTo: 'inference-provider-types', pathMatch: 'full' },
          {
            path: 'inference-provider-types',
            loadComponent: () =>
              import('./pages/inference-provider-types/list/list')
                .then(m => m.InferenceProviderTypesComponent)
          },
          {
            path: 'inference-provider-types/:code',
            loadComponent: () =>
              import('./pages/inference-provider-types/details/details')
                .then(m => m.InferenceProviderTypeDetailsComponent)
          },
          {
            path: 'storage-types',
            loadComponent: () =>
              import('./pages/storage-types/list/list')
                .then(m => m.StorageTypesComponent)
          },
          {
            path: 'storage-types/:code',
            loadComponent: () =>
              import('./pages/storage-types/details/details')
                .then(m => m.StorageTypeDetailsComponent)
          }
        ]
      }
    ]
  },
  {
    path: 'workspace',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/workspace-layout/workspace-layout')
        .then(m => m.WorkspaceLayoutComponent),
    children: [
      {
        path: 'inference-provider-types',
        loadComponent: () =>
          import('./pages/inference-provider-types/list/list')
            .then(m => m.InferenceProviderTypesComponent)
      },
      {
        path: 'inference-provider-types/:code',
        loadComponent: () =>
          import('./pages/inference-provider-types/details/details')
            .then(m => m.InferenceProviderTypeDetailsComponent)
      },
      {
        path: 'storage-types',
        loadComponent: () =>
          import('./pages/storage-types/list/list')
            .then(m => m.StorageTypesComponent)
      },
      {
        path: 'storage-types/:code',
        loadComponent: () =>
          import('./pages/storage-types/details/details')
            .then(m => m.StorageTypeDetailsComponent)
      },
      { path: '', redirectTo: 'storage-types', pathMatch: 'full' }
    ]
  },
  {
    path: 'project',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/project-layout/project-layout')
        .then(m => m.ProjectLayoutComponent),
    children: []
  },
  { path: '**', redirectTo: '/workspace-selector' }
];
