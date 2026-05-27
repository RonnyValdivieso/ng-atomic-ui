import { Component, computed, inject, output } from '@angular/core';

import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { ThemeToggleComponent } from '@atoms/theme-toggle';
import { AvatarComponent } from '@atoms/avatar';
import { TieredMenuComponent } from '@atoms/tiered-menu';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    ThemeToggleComponent,
    AvatarComponent,
    TieredMenuComponent
],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  readonly menuClicked = output<void>();

  constructor() {
    // Hydrate the user's name from the profile when the login response omitted it.
    this.auth.ensureDisplayName();
  }

  protected readonly userInitials = computed(() => {
    const user = this.auth.currentUser();
    const first = user?.firstName?.trim().charAt(0) ?? '';
    const last = user?.lastName?.trim().charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    if (initials) return initials;
    const emailInitial = user?.email?.trim().charAt(0).toUpperCase() ?? '';
    return emailInitial || '?';
  });

  protected readonly userMenuModels = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      {
        label: 'My account',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/admin/account/profile'])
      },
      { separator: true }
    ];
    if (this.auth.isSuperAdmin()) {
      items.push(
        {
          label: 'Administration',
          icon: 'pi pi-shield',
          command: () => this.router.navigate(['/admin'])
        },
        {
          label: 'Workspaces',
          icon: 'pi pi-th-large',
          command: () => this.router.navigate(['/workspace-selector'])
        },
        { separator: true }
      );
    }
    items.push({
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout()
    });
    return items;
  });

  protected onMenuClick(): void {
    this.menuClicked.emit();
  }
}
