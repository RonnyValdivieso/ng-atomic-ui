import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../_coming-soon/coming-soon';

@Component({
  selector: 'app-admin-organizations-list',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `<app-admin-coming-soon title="Organizations" subtitle="Manage organizations and their members." />`
})
export class AdminOrganizationsListComponent {}
