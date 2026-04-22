import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../_coming-soon/coming-soon';

@Component({
  selector: 'app-admin-roles-list',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `<app-admin-coming-soon title="System Roles" subtitle="System-wide roles managed by SuperAdmin." />`
})
export class AdminRolesListComponent {}
