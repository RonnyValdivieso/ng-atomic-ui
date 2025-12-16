import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '@molecules/form-field';

/**
 * FormFieldGuideComponent
 * Interactive guide showcasing the FormField molecule component with all its variants and usage examples.
 * Demonstrates form integration, validation states, and accessibility features.
 */
@Component({
  selector: 'app-form-field-guide',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './form-field-guide.html',
  styleUrls: ['./form-field-guide.css']
})
export class FormFieldGuideComponent {
  // Sample form data for demonstrations
  protected readonly formExamples = [
    {
      label: 'First Name',
      type: 'text' as const,
      placeholder: 'Enter your first name',
      required: true,
      size: 'medium' as const,
      errorMessage: ''
    },
    {
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'user@example.com',
      required: true,
      size: 'medium' as const,
      errorMessage: 'Please enter a valid email address'
    },
    {
      label: 'Phone Number',
      type: 'tel' as const,
      placeholder: '+1 (555) 123-4567',
      required: false,
      size: 'medium' as const,
      errorMessage: ''
    },
    {
      label: 'Password',
      type: 'password' as const,
      placeholder: 'Enter a secure password',
      required: true,
      size: 'medium' as const,
      errorMessage: 'Password must be at least 8 characters'
    }
  ];

  protected readonly validationStates = [
    {
      label: 'Valid Field',
      type: 'text' as const,
      placeholder: 'This field is valid',
      errorMessage: '',
      state: 'valid'
    },
    {
      label: 'Required Field',
      type: 'email' as const,
      placeholder: 'This field is required',
      errorMessage: 'This field is required',
      state: 'error'
    },
    {
      label: 'Invalid Format',
      type: 'email' as const,
      placeholder: 'invalid-email',
      errorMessage: 'Please enter a valid email address',
      state: 'error'
    }
  ];

  // Code examples for display
  protected readonly basicUsageCode = `<app-form-field 
  label="Email Address"
  type="email"
  size="medium"
  placeholder="user@example.com"
  [required]="true">
</app-form-field>`;

  protected readonly validationCode = `<app-form-field 
  label="Password"
  type="password"
  size="medium"
  [required]="true"
  errorMessage="Password must be at least 8 characters"
  placeholder="Enter a secure password">
</app-form-field>`;

  protected readonly sizesCode = `<!-- Small form field -->
<app-form-field 
  label="Small Field"
  type="text"
  size="small"
  placeholder="Small size" />

<!-- Medium form field (default) -->
<app-form-field 
  label="Medium Field"
  type="text"
  size="medium"
  placeholder="Medium size" />

<!-- Large form field -->
<app-form-field 
  label="Large Field"
  type="text"
  size="large"
  placeholder="Large size" />`;

  protected readonly inputTypesCode = `<!-- Text input -->
<app-form-field label="Name" type="text" />

<!-- Email input -->
<app-form-field label="Email" type="email" />

<!-- Password input -->
<app-form-field label="Password" type="password" />

<!-- Number input -->
<app-form-field label="Age" type="number" />

<!-- Phone input -->
<app-form-field label="Phone" type="tel" />

<!-- URL input -->
<app-form-field label="Website" type="url" />

<!-- Search input -->
<app-form-field label="Search" type="search" />`;

  protected readonly reactiveFormsCode = `import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^[\\d\\s\\-\\(\\)\\+]+$/)]
    });
  }
}

<!-- Template -->
<form [formGroup]="form">
  <app-form-field 
    label="First Name"
    type="text"
    formControlName="firstName"
    [required]="true"
    [errorMessage]="getErrorMessage('firstName')">
  </app-form-field>
  
  <app-form-field 
    label="Email"
    type="email"
    formControlName="email"
    [required]="true"
    [errorMessage]="getErrorMessage('email')">
  </app-form-field>
</form>`;

  protected readonly accessibilityCode = `<!-- Proper form field with accessibility -->
<app-form-field 
  label="Email Address"
  type="email"
  [required]="true"
  placeholder="Enter your email"
  errorMessage="Please enter a valid email address"
  aria-describedby="email-help">
</app-form-field>

<!-- Additional help text -->
<small id="email-help">
  We'll never share your email with anyone else.
</small>`;

  protected readonly bestPracticesItems = [
    {
      title: 'Use descriptive labels',
      description: 'Provide clear, concise labels that describe the expected input',
      example: 'label="Email Address" instead of "Email"'
    },
    {
      title: 'Include helpful placeholders',
      description: 'Use placeholders to show expected format or provide examples',
      example: 'placeholder="user@example.com"'
    },
    {
      title: 'Mark required fields',
      description: 'Clearly indicate which fields are required for form completion',
      example: '[required]="true" shows visual indicator'
    },
    {
      title: 'Provide clear error messages',
      description: 'Show specific, actionable error messages to help users',
      example: 'errorMessage="Please enter a valid email"'
    },
    {
      title: 'Choose appropriate input types',
      description: 'Use semantic input types for better UX and validation',
      example: 'type="email" for email fields'
    },
    {
      title: 'Size consistently',
      description: 'Use consistent field sizes within the same form context',
      example: 'size="medium" for most standard forms'
    }
  ];

  protected readonly accessibilityFeatures = [
    {
      feature: 'Label Association',
      description: 'Proper label-input association using for/id attributes',
      status: '✅ Implemented'
    },
    {
      feature: 'ARIA Attributes',
      description: 'Comprehensive ARIA support for screen readers',
      status: '✅ Implemented'
    },
    {
      feature: 'Error Announcements',
      description: 'Screen reader announcements for validation errors',
      status: '✅ Implemented'
    },
    {
      feature: 'Keyboard Navigation',
      description: 'Full keyboard support and logical tab order',
      status: '✅ Implemented'
    },
    {
      feature: 'Required Indicators',
      description: 'Visual and semantic indication of required fields',
      status: '✅ Implemented'
    },
    {
      feature: 'Focus Management',
      description: 'Proper focus styles and error focusing',
      status: '✅ Implemented'
    }
  ];

  protected readonly propsData = [
    {
      prop: 'label',
      type: 'string',
      default: "''",
      description: 'Label text for the form field'
    },
    {
      prop: 'placeholder',
      type: 'string', 
      default: "''",
      description: 'Placeholder text for the input'
    },
    {
      prop: 'type',
      type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'",
      default: "'text'",
      description: 'Input type for validation and behavior'
    },
    {
      prop: 'size',
      type: "'small' | 'medium' | 'large'",
      default: "'medium'",
      description: 'Visual size of the form field'
    },
    {
      prop: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Marks field as required'
    },
    {
      prop: 'errorMessage',
      type: 'string',
      default: "''",
      description: 'Error message to display when field is invalid'
    }
  ];

  protected readonly integrationData = [
    {
      feature: 'Reactive Forms',
      description: 'Full Angular Reactive Forms integration with ControlValueAccessor',
      status: '✅ Supported'
    },
    {
      feature: 'Template-driven Forms',
      description: 'Works with Angular template-driven forms and ngModel',
      status: '✅ Supported'
    },
    {
      feature: 'Form Validation',
      description: 'Integrates with Angular validators and custom validation',
      status: '✅ Supported'
    },
    {
      feature: 'Atomic Design',
      description: 'Composed of Label and Input atoms following design principles',
      status: '✅ Implemented'
    }
  ];

  // Helper methods for interactive examples
  protected getFieldId(index: number): string {
    return `demo-field-${index}`;
  }

  protected handleFieldInteraction(field: string): void {
    console.log(`Form field interaction: ${field}`);
  }

  protected simulateValidation(fieldType: string): string {
    const errorMessages: Record<string, string> = {
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters',
      required: 'This field is required',
      phone: 'Please enter a valid phone number'
    };
    return errorMessages[fieldType] || '';
  }
}