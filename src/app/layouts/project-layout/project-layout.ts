import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '@templates/main-layout';
import { NavigationItem } from '@organisms/sidebar';

@Component({
  selector: 'app-project-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MainLayoutComponent],
  template: `
    <app-main-layout [navigationItems]="navigationItems">
      <router-outlet></router-outlet>
    </app-main-layout>
  `
})
export class ProjectLayoutComponent {
  navigationItems: NavigationItem[] = [
    { label: 'Overview', icon: 'dashboard', route: '/project/overview' },
    { label: 'Tasks', icon: 'check_circle', route: '/project/tasks' },
    { label: 'Files', icon: 'folder', route: '/project/files' },
    { label: 'Settings', icon: 'settings', route: '/project/settings' }
  ];
}
