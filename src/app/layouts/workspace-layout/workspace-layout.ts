import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '@templates/main-layout';
import { NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MainLayoutComponent],
  template: `
    <app-main-layout [navigationItems]="navigationItems">
      <router-outlet></router-outlet>
    </app-main-layout>
  `
})
export class WorkspaceLayoutComponent {
  navigationItems: NavigationItem[] = [
    { label: 'Storage Types', icon: 'sd_storage', route: '/workspace/storage-types' },
    { label: 'Inference Provider Types', icon: 'memory', route: '/workspace/inference-provider-types' },
    { label: 'Workspaces', icon: 'grid_view', route: '/workspaces' },
    { label: 'Members', icon: 'group', route: '/members' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];
}
