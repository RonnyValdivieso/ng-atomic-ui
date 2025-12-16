import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '@atoms/avatar/avatar';

/**
 * AvatarGuideComponent
 * Interactive guide showcasing the Avatar component with all its variants, sizes, and usage examples.
 * Demonstrates best practices for user representation, status indicators, and accessibility.
 */
@Component({
  selector: 'app-avatar-guide',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './avatar-guide.html',
  styleUrls: ['./avatar-guide.css']
})
export class AvatarGuideComponent {
  // Sample user data for demonstrations
  protected readonly sampleUsers = [
    {
      name: 'John Doe',
      initials: 'JD',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      status: 'online' as const
    },
    {
      name: 'Jane Smith',
      initials: 'JS',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
      status: 'busy' as const
    },
    {
      name: 'Mike Johnson',
      initials: 'MJ',
      image: '',
      status: 'away' as const
    },
    {
      name: 'Sarah Wilson',
      initials: 'SW',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      status: 'offline' as const
    }
  ];

  // Code examples for display
  protected readonly basicUsageCode = `<app-avatar 
  src="/assets/user.jpg"
  alt="John Doe"
  size="md"
  variant="circular">
</app-avatar>`;

  protected readonly initialsCode = `<app-avatar 
  initials="JD"
  alt="John Doe"
  size="lg"
  variant="circular"
  status="online">
</app-avatar>`;

  protected readonly statusIndicatorCode = `<!-- Online user -->
<app-avatar 
  src="/assets/user.jpg"
  alt="John Doe"
  status="online" />

<!-- Busy user -->
<app-avatar 
  initials="JS"
  alt="Jane Smith"
  status="busy" />

<!-- Away user -->
<app-avatar 
  initials="MJ"
  alt="Mike Johnson"
  status="away" />`;

  protected readonly interactiveCode = `<app-avatar 
  src="/assets/user.jpg"
  alt="User Profile"
  [clickable]="true"
  size="xl"
  (clicked)="openUserProfile()">
</app-avatar>`;

  protected readonly responsiveCode = `<!-- Different sizes for different contexts -->
<app-avatar size="xs" />  <!-- Navigation bar -->
<app-avatar size="sm" />  <!-- Comments -->
<app-avatar size="md" />  <!-- Default -->
<app-avatar size="lg" />  <!-- Profile cards -->
<app-avatar size="xl" />  <!-- User profile -->
<app-avatar size="2xl" /> <!-- Hero sections -->`;

  protected readonly accessibilityCode = `<!-- Proper alt text -->
<app-avatar 
  src="/assets/user.jpg"
  alt="John Doe - Software Engineer"
  size="md" />

<!-- Screen reader friendly initials -->
<app-avatar 
  initials="JD"
  alt="John Doe profile picture"
  [clickable]="true"
  (clicked)="viewProfile()" />

<!-- Loading state -->
<app-avatar 
  [loading]="isLoadingUser"
  alt="Loading user profile" />`;

  protected readonly bestPracticesItems = [
    {
      title: 'Always provide alt text',
      description: 'Include descriptive alt text for screen readers and accessibility',
      example: 'alt="John Doe - Software Engineer"'
    },
    {
      title: 'Use appropriate sizes',
      description: 'Choose avatar sizes that fit the context and hierarchy',
      example: 'xs for navigation, lg for profiles'
    },
    {
      title: 'Fallback to initials',
      description: 'When images fail to load, show user initials as fallback',
      example: 'initials="JD" for John Doe'
    },
    {
      title: 'Status indicators',
      description: 'Use status indicators to show user availability',
      example: 'status="online" | "busy" | "away"'
    },
    {
      title: 'Clickable feedback',
      description: 'Make clickable avatars obvious with proper hover states',
      example: '[clickable]="true" with click handlers'
    }
  ];

  protected readonly accessibilityFeatures = [
    {
      feature: 'Semantic HTML',
      description: 'Uses proper img elements and ARIA attributes',
      status: '✅ Implemented'
    },
    {
      feature: 'Alt Text Support',
      description: 'Comprehensive alt text for all avatar states',
      status: '✅ Implemented'
    },
    {
      feature: 'Keyboard Navigation',
      description: 'Full keyboard support for interactive avatars',
      status: '✅ Implemented'
    },
    {
      feature: 'Screen Reader Labels',
      description: 'Descriptive labels for status indicators',
      status: '✅ Implemented'
    },
    {
      feature: 'Loading States',
      description: 'Accessible loading indicators and feedback',
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
      prop: 'src',
      type: 'string',
      default: "''",
      description: 'Image source URL for the avatar'
    },
    {
      prop: 'alt',
      type: 'string', 
      default: "''",
      description: 'Alt text for accessibility'
    },
    {
      prop: 'initials',
      type: 'string',
      default: "''",
      description: 'User initials as fallback content'
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
      default: "'md'",
      description: 'Visual size of the avatar'
    },
    {
      prop: 'variant',
      type: "'circular' | 'rounded' | 'square'",
      default: "'circular'",
      description: 'Shape variant of the avatar'
    },
    {
      prop: 'status',
      type: "'online' | 'offline' | 'away' | 'busy' | 'none'",
      default: "'none'",
      description: 'Status indicator for user availability'
    },
    {
      prop: 'clickable',
      type: 'boolean',
      default: 'false',
      description: 'Makes the avatar interactive'
    },
    {
      prop: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disabled state styling'
    },
    {
      prop: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows loading spinner'
    }
  ];

  protected readonly eventsData = [
    {
      event: 'clicked',
      type: 'void',
      description: 'Emitted when avatar is clicked (if clickable)'
    },
    {
      event: 'imageError',
      type: 'void',
      description: 'Emitted when image fails to load'
    },
    {
      event: 'imageLoaded',
      type: 'void',
      description: 'Emitted when image loads successfully'
    }
  ];

  // Event handlers for interactive examples
  protected handleAvatarClick(user?: any): void {
    console.log('Avatar clicked:', user?.name || 'Anonymous user');
  }

  protected handleImageError(): void {
    console.log('Image failed to load');
  }

  protected handleImageLoaded(): void {
    console.log('Image loaded successfully');
  }
}