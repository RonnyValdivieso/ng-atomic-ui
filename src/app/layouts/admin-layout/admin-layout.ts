import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '@templates/main-layout';
import { NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, MainLayoutComponent],
  template: `
    <app-main-layout [navigationItems]="navigationItems">
      <router-outlet></router-outlet>
    </app-main-layout>
  `
})
export class AdminLayoutComponent {
  navigationItems: NavigationItem[] = [
    {
      label: 'Administration',
      icon: 'pi-shield',
      children: [
        { label: 'Workspaces', icon: 'pi-th-large', route: '/admin/workspaces' },
        { label: 'Organizations', icon: 'pi-building', route: '/admin/organizations' },
        { label: 'Service Teams', icon: 'pi-sitemap', route: '/admin/service-teams' },
        { label: 'System Roles', icon: 'pi-id-card', route: '/admin/roles' },
        { label: 'Modules & Permissions', icon: 'pi-lock', route: '/admin/modules' },
        { label: 'Notification Templates', icon: 'pi-envelope', route: '/admin/notification-templates' },
        { label: 'Authentication Log', icon: 'pi-history', route: '/admin/authentication-log' }
      ]
    },
    {
      label: 'Platform',
      icon: 'pi-cog',
      children: [
        { label: 'Inference Provider Types', icon: 'pi-microchip-ai', route: '/admin/platform/inference-provider-types' },
        { label: 'Storage Types', icon: 'pi-database', route: '/admin/platform/storage-types' }
      ]
    },
    {
      label: 'Apps',
      icon: 'pi-objects-column',
      children: [
        { label: 'App Categories', icon: 'pi-tags', route: '/admin/app-categories' },
        { label: 'Brandbot Apps', icon: 'pi-objects-column', route: '/admin/brandbot-apps' }
      ]
    }
  ];
}
