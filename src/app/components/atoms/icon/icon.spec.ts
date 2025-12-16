import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      // Set required input
      fixture.componentRef.setInput('name', 'search');
      fixture.detectChanges();
      
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      fixture.componentRef.setInput('name', 'search');
      fixture.detectChanges();

      expect(component.size()).toBe('base');
      expect(component.color()).toBe('inherit');
      expect(component.disabled()).toBe(false);
      expect(component.spin()).toBe(false);
      expect(component.clickable()).toBe(false);
      expect(component.ariaHidden()).toBe(true);
    });

    it('should require name input', () => {
      expect(() => {
        fixture.detectChanges();
      }).toThrow();
    });
  });

  describe('Icon Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
      fixture.detectChanges();
    });

    it('should render icon with correct classes', () => {
      const icon = compiled.querySelector('i');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('pi')).toBe(true);
      expect(icon?.classList.contains('pi-search')).toBe(true);
      expect(icon?.classList.contains('icon')).toBe(true);
    });

    it('should handle icon names with pi- prefix', () => {
      fixture.componentRef.setInput('name', 'pi-home');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('pi-home')).toBe(true);
    });

    it('should handle icon names without pi- prefix', () => {
      fixture.componentRef.setInput('name', 'user');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('pi-user')).toBe(true);
    });
  });

  describe('Size Variants', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
    });

    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--size-sm')).toBe(true);
      expect(icon?.style.fontSize).toBe('0.875rem');
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--size-xl')).toBe(true);
      expect(icon?.style.fontSize).toBe('1.5rem');
    });

    it('should apply default base size', () => {
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--size-base')).toBe(true);
      expect(icon?.style.fontSize).toBe('1rem');
    });
  });

  describe('Color Variants', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
    });

    it('should apply primary color class', () => {
      fixture.componentRef.setInput('color', 'primary');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--color-primary')).toBe(true);
    });

    it('should apply danger color class', () => {
      fixture.componentRef.setInput('color', 'danger');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--color-danger')).toBe(true);
    });

    it('should apply inherit color by default', () => {
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--color-inherit')).toBe(true);
    });
  });

  describe('States', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
    });

    it('should apply disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--disabled')).toBe(true);
    });

    it('should apply spin animation', () => {
      fixture.componentRef.setInput('spin', true);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--spin')).toBe(true);
    });

    it('should apply clickable state', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon--clickable')).toBe(true);
      expect(icon?.getAttribute('role')).toBe('button');
      expect(icon?.getAttribute('tabindex')).toBe('0');
    });

    it('should not be tabbable when disabled and clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.getAttribute('tabindex')).toBe(null);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
    });

    it('should set aria-hidden by default', () => {
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set custom aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Search icon');
      fixture.componentRef.setInput('ariaHidden', false);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.getAttribute('aria-label')).toBe('Search icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('false');
    });

    it('should not set aria-label when not provided', () => {
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.getAttribute('aria-label')).toBe(null);
    });
  });

  describe('Static Helpers', () => {
    it('should have common icons constant', () => {
      expect(IconComponent.COMMON_ICONS.search).toBe('pi-search');
      expect(IconComponent.COMMON_ICONS.user).toBe('pi-user');
      expect(IconComponent.COMMON_ICONS.home).toBe('pi-home');
    });

    it('should get icon name from key', () => {
      expect(IconComponent.getIconName('search')).toBe('pi-search');
      expect(IconComponent.getIconName('user')).toBe('pi-user');
    });

    it('should validate icon names', () => {
      expect(IconComponent.isValidIcon('pi-search')).toBe(true);
      expect(IconComponent.isValidIcon('pi-user')).toBe(true);
      expect(IconComponent.isValidIcon('invalid-icon')).toBe(false);
    });
  });

  describe('CSS Classes Application', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('name', 'search');
    });

    it('should apply multiple classes correctly', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('color', 'primary');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.classList.contains('icon')).toBe(true);
      expect(icon?.classList.contains('pi')).toBe(true);
      expect(icon?.classList.contains('pi-search')).toBe(true);
      expect(icon?.classList.contains('icon--size-lg')).toBe(true);
      expect(icon?.classList.contains('icon--color-primary')).toBe(true);
      expect(icon?.classList.contains('icon--disabled')).toBe(true);
    });

    it('should apply correct inline font-size', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();

      const icon = compiled.querySelector('i');
      expect(icon?.style.fontSize).toBe('1.5rem');
    });
  });
});