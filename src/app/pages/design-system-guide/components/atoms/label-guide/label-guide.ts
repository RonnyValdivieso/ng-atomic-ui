import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '@atoms/label';

/**
 * LabelGuideComponent
 * Interactive guide showcasing the Label component with all its variants and usage examples.
 * Demonstrates best practices for accessibility, different sizes, and proper implementation.
 */
@Component({
  selector: 'app-label-guide',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  templateUrl: './label-guide.html',
  styleUrls: ['./label-guide.css']
})
export class LabelGuideComponent {
  // Form example data
  protected readonly exampleFormId = 'example-email-input';
  protected readonly exampleCheckboxId = 'example-checkbox';
  
  // Code examples for display
  protected readonly basicUsageCode = `<app-label 
  text="Email Address"
  [for]="emailInputId"
  size="medium">
</app-label>`;

  protected readonly requiredLabelCode = `<app-label 
  text="Password"
  [for]="passwordInputId"
  [required]="true"
  size="medium">
</app-label>`;

  protected readonly variantExamplesCode = `<!-- Default variant -->
<app-label text="Default Label" variant="default" />

<!-- Secondary variant -->
<app-label text="Secondary Label" variant="secondary" />

<!-- Accent variant -->
<app-label text="Accent Label" variant="accent" />`;

  protected readonly accessibilityCode = `<!-- Proper form association -->
<app-label 
  text="Email Address"
  [for]="emailInputId"
  [required]="true"
  size="medium">
</app-label>
<input 
  [id]="emailInputId" 
  type="email" 
  aria-describedby="email-help" />

<!-- Screen reader friendly -->
<app-label 
  text="Phone Number"
  [for]="phoneInputId"
  aria-label="Phone number (required)">
</app-label>`;

  protected readonly bestPracticesItems = [
    {
      title: 'Always use "for" attribute',
      description: 'Connect labels to their form controls for proper accessibility',
      example: 'for="input-id"'
    },
    {
      title: 'Clear and descriptive text',
      description: 'Use concise but descriptive label text that explains the input purpose',
      example: '"Email Address" instead of "Email"'
    },
    {
      title: 'Indicate required fields',
      description: 'Use the required prop to add visual and semantic indication',
      example: '[required]="true"'
    },
    {
      title: 'Consistent sizing',
      description: 'Use consistent label sizes within the same form or context',
      example: 'size="medium" for most forms'
    },
    {
      title: 'Proper contrast',
      description: 'Ensure labels have sufficient color contrast for readability',
      example: 'Default variant provides optimal contrast'
    }
  ];

  protected readonly accessibilityFeatures = [
    {
      feature: 'Semantic HTML',
      description: 'Uses proper <label> element for form association',
      status: '✅ Implemented'
    },
    {
      feature: 'ARIA Labels',
      description: 'Provides descriptive aria-label for screen readers',
      status: '✅ Implemented'
    },
    {
      feature: 'Required Indication',
      description: 'Visual and semantic indication of required fields',
      status: '✅ Implemented'
    },
    {
      feature: 'Focus Management',
      description: 'Proper focus styles for keyboard navigation',
      status: '✅ Implemented'
    },
    {
      feature: 'High Contrast Support',
      description: 'Adapts to high contrast mode preferences',
      status: '✅ Implemented'
    }
  ];

  protected readonly propsData = [
    {
      prop: 'text',
      type: 'string',
      default: "''",
      description: 'The label text content'
    },
    {
      prop: 'for',
      type: 'string', 
      default: "''",
      description: 'ID of the associated form control'
    },
    {
      prop: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Visual size of the label'
    },
    {
      prop: 'variant',
      type: "'default' | 'secondary' | 'accent'",
      default: "'default'",
      description: 'Color variant of the label'
    },
    {
      prop: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Shows required indicator (*)'
    },
    {
      prop: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disabled state styling'
    }
  ];
}