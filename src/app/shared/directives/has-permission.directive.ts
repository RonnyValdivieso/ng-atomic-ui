import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject
} from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

/**
 * Structural directive that renders its content only when the current user
 * has the given AAA permission. Usage:
 *
 *   <button *hasPermission="'UsersEdit'">Edit user</button>
 *
 * Reactive — re-evaluates whenever the permission set changes (login, logout,
 * permission refresh).
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);

  private requiredPermission: string | null = null;
  private viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor() {
    effect(() => {
      // Track the permissions signal so this effect re-runs on changes.
      const perms = this.auth.permissions();
      this.render(perms);
    });
  }

  @Input({ required: true })
  set hasPermission(permission: string) {
    this.requiredPermission = permission;
    this.render(this.auth.permissions());
  }

  private render(perms: Set<string>): void {
    const allowed = !!this.requiredPermission && perms.has(this.requiredPermission);
    if (allowed && !this.viewRef) {
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!allowed && this.viewRef) {
      this.viewContainer.clear();
      this.viewRef = null;
    }
  }
}
