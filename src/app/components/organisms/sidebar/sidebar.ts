import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  host: {
    '[class.collapsed]': 'collapsed()'
  }
})
export class SidebarComponent {
  readonly navigationItems = input<NavigationItem[]>([]);
  readonly collapsed = input<boolean>(false);

  readonly toggleCollapse = output<void>();
}
