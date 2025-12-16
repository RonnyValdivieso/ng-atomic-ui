import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { BreadcrumbComponent } from '@molecules/breadcrumb';

@Component({
  selector: 'app-breadcrumb-guide',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './breadcrumb-guide.html',
  styleUrls: ['./breadcrumb-guide.css']
})
export class BreadcrumbGuideComponent {
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  items: MenuItem[] = [
    { label: 'Dashboard' },
    { label: 'Settings' },
    { label: 'Profile' }
  ];

  complexItems: MenuItem[] = [
    { label: 'Products', icon: 'pi pi-box' },
    { label: 'Electronics', icon: 'pi pi-bolt' },
    { label: 'Accessories', icon: 'pi pi-tag' }
  ];

  onItemClick(item: MenuItem) {
    console.log('Breadcrumb item clicked:', item);
  }
}
