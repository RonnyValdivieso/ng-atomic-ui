import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../_coming-soon/coming-soon';

@Component({
  selector: 'app-admin-authentication-log-list',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `<app-admin-coming-soon title="Authentication Log" subtitle="Read-only audit trail of login attempts." />`
})
export class AdminAuthenticationLogListComponent {}
