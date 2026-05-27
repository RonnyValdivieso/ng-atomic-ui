import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { AvatarComponent } from '@atoms/avatar';
import { AuthService } from '@shared/services/auth/auth.service';
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private host = inject(ElementRef<HTMLElement>);
  protected theme = inject(ThemeService);

  protected readonly menuOpen = signal(false);

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

  protected readonly userName = computed(() => {
    const user = this.auth.currentUser();
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return name || user?.email || 'Account';
  });

  protected readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  protected readonly userRole = computed(() => (this.auth.isSuperAdmin() ? 'SUPER ADMIN' : 'OPERATOR'));

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update(open => !open);
  }

  protected go(path: string): void {
    this.menuOpen.set(false);
    this.router.navigate([path]);
  }

  protected logout(): void {
    this.menuOpen.set(false);
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }
}
