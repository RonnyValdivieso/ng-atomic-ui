import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface AccountNavGroup {
  group: string;
  items: { id: string; label: string; icon: string }[];
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './account.html',
  styleUrls: ['./account.shared.css', './account.css']
})
export class AccountComponent {
  protected readonly nav: AccountNavGroup[] = [
    {
      group: 'Account',
      items: [
        { id: 'profile', label: 'Profile', icon: 'pi-id-card' },
        { id: 'security', label: 'Two-step verification', icon: 'pi-shield' }
      ]
    }
  ];
}
