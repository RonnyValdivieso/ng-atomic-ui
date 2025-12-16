import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@atoms/badge';

/**
 * BadgeGuideComponent
 * Interactive guide showcasing the Badge component with all its variants, colors, and usage examples.
 * Demonstrates notification badges, status indicators, and positioning options.
 */
@Component({
  selector: 'app-badge-guide',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './badge-guide.html',
  styleUrls: ['./badge-guide.css']
})
export class BadgeGuideComponent {
  // Sample badge configurations for demonstrations
  protected readonly notificationCounts = [0, 1, 5, 12, 99, 100, 999, 1000];
  
  protected readonly statusItems = [
    { label: 'Online', color: 'success' as const, pulse: true },
    { label: 'Away', color: 'warning' as const, pulse: false },
    { label: 'Busy', color: 'danger' as const, pulse: false },
    { label: 'Offline', color: 'neutral' as const, pulse: false },
    { label: 'Premium', color: 'primary' as const, pulse: true }
  ];

  protected readonly categoryBadges = [
    { text: 'New', color: 'success' as const, variant: 'solid' as const },
    { text: 'Hot', color: 'danger' as const, variant: 'solid' as const },
    { text: 'Sale', color: 'warning' as const, variant: 'outline' as const },
    { text: 'Featured', color: 'primary' as const, variant: 'soft' as const },
    { text: 'Limited', color: 'info' as const, variant: 'outline' as const }
  ];

  // Code examples for display
  protected readonly basicUsageCode = `<app-badge 
  text="New"
  variant="solid"
  color="primary"
  size="sm">
</app-badge>`;

  protected readonly countBadgeCode = `<app-badge 
  [count]="5"
  variant="solid"
  color="danger"
  size="xs"
  position="top-right">
</app-badge>`;

  protected readonly statusDotCode = `<!-- Status indicator dot -->
<app-badge 
  variant="dot"
  color="success"
  [pulse]="true"
  size="sm">
</app-badge>

<!-- Alternative dot syntax -->
<app-badge 
  [dot]="true"
  color="warning"
  size="md">
</app-badge>`;

  protected readonly variantExamplesCode = `<!-- Solid variant -->
<app-badge text="Solid" variant="solid" color="primary" />

<!-- Outline variant -->
<app-badge text="Outline" variant="outline" color="primary" />

<!-- Soft variant -->
<app-badge text="Soft" variant="soft" color="primary" />

<!-- Dot variant -->
<app-badge variant="dot" color="primary" />`;

  protected readonly interactiveCode = `<app-badge 
  text="Click me"
  variant="solid"
  color="primary"
  [clickable]="true"
  (clicked)="handleBadgeClick()">
</app-badge>`;

  protected readonly positionedCode = `<!-- Positioned notification badge -->
<div class="relative">
  <button class="btn">Messages</button>
  <app-badge 
    [count]="3"
    variant="solid"
    color="danger"
    size="xs"
    position="top-right">
  </app-badge>
</div>`;

  protected readonly accessibilityCode = `<!-- Proper ARIA labels -->
<app-badge 
  [count]="5"
  variant="solid"
  color="danger"
  ariaLabel="5 unread notifications">
</app-badge>

<!-- Screen reader friendly -->
<app-badge 
  text="New"
  variant="solid"
  color="success"
  ariaLabel="New item available">
</app-badge>`;

  protected readonly bestPracticesItems = [
    {
      title: 'Use semantic colors',
      description: 'Choose colors that match the badge meaning (danger for errors, success for completion)',
      example: 'color="danger" for notifications'
    },
    {
      title: 'Provide meaningful labels',
      description: 'Include descriptive ARIA labels for screen readers',
      example: 'ariaLabel="5 unread messages"'
    },
    {
      title: 'Size appropriately',
      description: 'Use smaller sizes for subtle indicators, larger for important information',
      example: 'size="xs" for notifications, size="md" for categories'
    },
    {
      title: 'Consider max counts',
      description: 'Set reasonable maxCount values to prevent UI overflow',
      example: '[maxCount]="99" shows 99+ for large numbers'
    },
    {
      title: 'Use dots for status',
      description: 'Prefer dot variants for simple status indicators',
      example: 'variant="dot" with pulse for online status'
    }
  ];

  protected readonly accessibilityFeatures = [
    {
      feature: 'ARIA Labels',
      description: 'Comprehensive aria-label support for screen readers',
      status: '✅ Implemented'
    },
    {
      feature: 'Keyboard Navigation',
      description: 'Full keyboard support for interactive badges',
      status: '✅ Implemented'
    },
    {
      feature: 'Semantic Roles',
      description: 'Proper role attributes for clickable badges',
      status: '✅ Implemented'
    },
    {
      feature: 'Visual Indicators',
      description: 'Clear visual feedback for different states',
      status: '✅ Implemented'
    },
    {
      feature: 'Screen Reader Text',
      description: 'Descriptive text for count and status badges',
      status: '✅ Implemented'
    },
    {
      feature: 'Focus Management',
      description: 'Proper focus styles and tab order',
      status: '✅ Implemented'
    }
  ];

  protected readonly propsData = [
    {
      prop: 'text',
      type: 'string',
      default: "''",
      description: 'Text content for the badge'
    },
    {
      prop: 'count',
      type: 'number | null', 
      default: 'null',
      description: 'Numeric count with max count formatting'
    },
    {
      prop: 'variant',
      type: "'solid' | 'outline' | 'soft' | 'dot'",
      default: "'solid'",
      description: 'Visual style variant of the badge'
    },
    {
      prop: 'color',
      type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'",
      default: "'primary'",
      description: 'Color scheme of the badge'
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the badge'
    },
    {
      prop: 'position',
      type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | null",
      default: 'null',
      description: 'Position for overlay badges'
    },
    {
      prop: 'maxCount',
      type: 'number',
      default: '99',
      description: 'Maximum count before showing +'
    },
    {
      prop: 'showZero',
      type: 'boolean',
      default: 'false',
      description: 'Show badge when count is 0'
    },
    {
      prop: 'dot',
      type: 'boolean',
      default: 'false',
      description: 'Show as dot indicator'
    },
    {
      prop: 'pulse',
      type: 'boolean',
      default: 'false',
      description: 'Add pulsing animation'
    },
    {
      prop: 'clickable',
      type: 'boolean',
      default: 'false',
      description: 'Make badge interactive'
    },
    {
      prop: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disabled state styling'
    }
  ];

  protected readonly eventsData = [
    {
      event: 'clicked',
      type: 'void',
      description: 'Emitted when badge is clicked (if clickable)'
    }
  ];

  // Event handlers for interactive examples
  protected handleBadgeClick(badgeType?: string): void {
    console.log('Badge clicked:', badgeType || 'Generic badge');
  }

  protected toggleNotification(): void {
    console.log('Notification badge clicked');
  }

  // Helper methods for dynamic examples
  protected getStatusLabel(color: string): string {
    const statusMap: Record<string, string> = {
      success: 'Online',
      warning: 'Away', 
      danger: 'Busy',
      neutral: 'Offline',
      primary: 'Premium'
    };
    return statusMap[color] || 'Status';
  }

  protected formatNotificationText(count: number): string {
    if (count === 0) return 'No notifications';
    if (count === 1) return '1 notification';
    return `${count} notifications`;
  }
}