import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../_coming-soon/coming-soon';

@Component({
  selector: 'app-admin-modules-list',
  standalone: true,
  imports: [ComingSoonComponent],
  template: `<app-admin-coming-soon title="Modules & Permissions" subtitle="Permission registry grouped by module." />`
})
export class AdminModulesListComponent {}
