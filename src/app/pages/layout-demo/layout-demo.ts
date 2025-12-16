import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '@templates/main-layout';
import { type NavigationItem } from '@organisms/sidebar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'app-layout-demo',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ButtonModule, CardModule],
  template: `
    <app-main-layout [navigationItems]="navigation">
      <!-- Content projected into the layout -->
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-color">Dashboard</h1>
            <p class="text-muted-color mt-1">Welcome back! Here's what's happening with your design system.</p>
          </div>
          <p-button label="New Component" icon="pi pi-plus" class="w-full sm:w-auto"></p-button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-surface-0 p-6 rounded-lg border border-surface-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-color">Total Components</p>
                <p class="text-2xl font-bold text-color mt-1">24</p>
              </div>
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-palette text-primary text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-surface-0 p-6 rounded-lg border border-surface-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-color">Active Projects</p>
                <p class="text-2xl font-bold text-color mt-1">8</p>
              </div>
              <div class="w-12 h-12 bg-highlight rounded-lg flex items-center justify-center">
                <i class="pi pi-folder text-color text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-surface-0 p-6 rounded-lg border border-surface-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-color">Team Members</p>
                <p class="text-2xl font-bold text-color mt-1">12</p>
              </div>
              <div class="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-users text-color text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-surface-0 p-6 rounded-lg border border-surface-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-color">Updates</p>
                <p class="text-2xl font-bold text-color mt-1">5</p>
              </div>
              <div class="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-bell text-color text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-surface-0 p-6 rounded-lg border border-surface-200 shadow-sm">
          <h2 class="text-xl font-semibold text-color mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 bg-surface-50 rounded-lg">
              <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-check text-primary"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-color">Button component updated</p>
                <p class="text-sm text-muted-color">New variant added for better accessibility</p>
              </div>
              <span class="text-sm text-muted-color">2 hours ago</span>
            </div>

            <div class="flex items-center gap-4 p-4 bg-surface-50 rounded-lg">
              <div class="w-10 h-10 bg-highlight rounded-lg flex items-center justify-center">
                <i class="pi pi-plus text-color"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-color">New Icon component created</p>
                <p class="text-sm text-muted-color">Added to atoms library with documentation</p>
              </div>
              <span class="text-sm text-muted-color">1 day ago</span>
            </div>

            <div class="flex items-center gap-4 p-4 bg-surface-50 rounded-lg">
              <div class="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-file text-color"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-color">Documentation updated</p>
                <p class="text-sm text-muted-color">Form field component guide enhanced</p>
              </div>
              <span class="text-sm text-muted-color">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    /* Component specific styles */
  `]
})
export class LayoutDemoComponent {
  private readonly navigationService = inject(NavigationService);

  // Navigation items for the sidebar
  protected readonly navigation: NavigationItem[] = this.navigationService.getMainNavigation();
}