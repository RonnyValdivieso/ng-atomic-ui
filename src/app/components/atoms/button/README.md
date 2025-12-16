# ButtonComponent

Reusable button atom enhanced with PrimeNG Button component for better functionality and accessibility.

## 🎯 Overview

The `ButtonComponent` is a fundamental atom in our design system that provides a consistent button interface across the application. It leverages PrimeNG Button internally while maintaining our custom design system API.

## ✨ Features

- **PrimeNG Integration**: Uses PrimeNG Button internally for enhanced functionality
- **Design System API**: Maintains custom variant system (primary, secondary, danger, success)
- **Size Variants**: Small, medium, large sizes
- **Icon Support**: Full PrimeIcons support
- **Accessibility**: ARIA attributes and keyboard navigation
- **Loading State**: Built-in loading indicator
- **Type Safety**: Full TypeScript support

## 🎨 Usage

### Basic Button
```html
<app-button 
  variant="primary" 
  size="medium" 
  (clicked)="handleClick()">
  Click Me
</app-button>
```

### Button with Icon
```html
<app-button 
  variant="success"
  icon="pi pi-check"
  (clicked)="handleSave()">
  Save
</app-button>
```

### Loading Button
```html
<app-button 
  variant="primary"
  [loading]="isLoading"
  (clicked)="handleAsyncAction()">
  Submit
</app-button>
```

## 📋 Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state with spinner |
| `icon` | `string` | `undefined` | PrimeIcon class (e.g., 'pi pi-save') |

## 🎭 Events

| Event | Type | Description |
|-------|------|-------------|
| `clicked` | `void` | Emitted when button is clicked |

## 🎨 Styling

The component uses CSS custom properties for theming:

```css
.app-button {
  /* Design system tokens are mapped to PrimeNG variables */
  --button-primary-bg: var(--primary);
  --button-secondary-bg: var(--secondary);
  --button-danger-bg: var(--danger);
  --button-success-bg: var(--success);
}
```

## 🏗️ Architecture

### PrimeNG Integration
- Uses PrimeNG Button (`p-button`) internally
- Maps design system variants to PrimeNG severity
- Maintains backward compatibility with existing API
- Leverages PrimeNG's accessibility features

### Computed Properties
```typescript
// Maps design system variants to PrimeNG severity
severity = computed(() => {
  switch (this.variant()) {
    case 'danger': return 'danger';
    case 'success': return 'success';
    case 'secondary': return 'secondary';
    default: return 'primary';
  }
});

// Maps design system sizes to PrimeNG sizes
primeSize = computed(() => {
  switch (this.size()) {
    case 'small': return 'small';
    case 'large': return 'large';
    default: return undefined; // PrimeNG default
  }
});
```

## 🧪 Testing

The component includes comprehensive tests:

```typescript
// Test PrimeNG integration
it('should render PrimeNG button with correct attributes', () => {
  fixture.componentRef.setInput('variant', 'primary');
  fixture.detectChanges();
  
  const buttonElement = fixture.nativeElement.querySelector('p-button');
  expect(buttonElement.getAttribute('ng-reflect-severity')).toBe('primary');
});
```

## 🔄 Migration Notes

This component has been enhanced from a native HTML button to use PrimeNG Button:

### Benefits
- Enhanced accessibility (ARIA attributes, keyboard navigation)
- Better loading state animation
- Consistent styling with PrimeNG theme system
- Icon support out of the box

### Breaking Changes
- None - the public API remains the same
- CSS selectors changed from `button` to `p-button`

## 🎯 Best Practices

1. **Use semantic variants**: Choose variants based on action meaning, not just color
2. **Provide clear labels**: Use descriptive text or ARIA labels
3. **Handle loading states**: Use the loading property for async operations
4. **Icon consistency**: Use PrimeIcons for consistency across the app

## 📦 Dependencies

- **PrimeNG Button**: Core button functionality
- **PrimeIcons**: Icon support
- **Angular Animations**: Loading and hover effects

## 🔮 Future Enhancements

- [ ] Add more size variants (xs, xl)
- [ ] Support for icon-only buttons
- [ ] Custom themes integration
- [ ] Tooltip integration