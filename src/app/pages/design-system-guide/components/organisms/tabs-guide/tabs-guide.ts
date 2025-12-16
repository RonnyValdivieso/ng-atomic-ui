import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent, TabItem } from '@organisms/tabs';

@Component({
  selector: 'app-tabs-guide',
  standalone: true,
  imports: [CommonModule, TabsComponent],
  templateUrl: './tabs-guide.html',
  styleUrls: ['./tabs-guide.css']
})
export class TabsGuideComponent {
  // Basic Usage
  basicValue = signal('dashboard');
  basicTabs: TabItem[] = [
    { title: 'Dashboard', content: 'Dashboard Content', value: 'dashboard' },
    { title: 'Transactions', content: 'Transactions History', value: 'transactions' },
    { title: 'Settings', content: 'User Settings', value: 'settings' }
  ];

  // Disabled Tab
  disabledValue = signal('profile');
  disabledTabs: TabItem[] = [
    { title: 'Profile', content: 'Profile Information', value: 'profile' },
    { title: 'Security', content: 'Security Settings', value: 'security', disabled: true },
    { title: 'Notifications', content: 'Notification Preferences', value: 'notifications' }
  ];

  // Template Usage
  templateValue = signal('stats');
  templateTabs: TabItem[] = [
    { title: 'Statistics', content: 'stats', value: 'stats' }, // Content string matches template ref name logic if we used strings, but here we'll use template refs in HTML
    { title: 'Reports', content: 'reports', value: 'reports' }
  ];

  onTabChange(value: any) {
    console.log('Active tab changed:', value);
  }
}
