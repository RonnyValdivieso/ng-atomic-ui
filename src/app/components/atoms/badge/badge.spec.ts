import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BadgeComponent, BadgeVariant, BadgeColor, BadgeSize, BadgePosition } from './badge';
import { IconComponent } from '../icon';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent, IconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Rendering', () => {
    it('should render without content when no inputs provided', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl).toBeTruthy();
      expect(badgeEl.nativeElement.textContent.trim()).toBe('');
    });

    it('should render text content', () => {
      fixture.componentRef.setInput('text', 'New');
      fixture.detectChanges();

      const contentEl = debugElement.query(By.css('.badge__text'));
      expect(contentEl.nativeElement.textContent.trim()).toBe('New');
    });

    it('should render numeric content', () => {
      fixture.componentRef.setInput('count', 42);
      fixture.detectChanges();

      const contentEl = debugElement.query(By.css('.badge__text'));
      expect(contentEl.nativeElement.textContent.trim()).toBe('42');
    });
  });

  describe('Variants', () => {
    const variants: BadgeVariant[] = ['solid', 'outline', 'soft', 'dot'];

    variants.forEach(variant => {
      it(`should apply ${variant} variant class`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const badgeEl = debugElement.query(By.css('.badge'));
        expect(badgeEl.nativeElement).toHaveClass(`badge--${variant}`);
      });
    });

    it('should default to solid variant', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--solid');
    });
  });

  describe('Colors', () => {
    const colors: BadgeColor[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral'];

    colors.forEach(color => {
      it(`should apply ${color} color class`, () => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();

        const badgeEl = debugElement.query(By.css('.badge'));
        expect(badgeEl.nativeElement).toHaveClass(`badge--${color}`);
      });
    });

    it('should default to primary color', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--primary');
    });
  });

  describe('Sizes', () => {
    const sizes: BadgeSize[] = ['xs', 'sm', 'md', 'lg'];

    sizes.forEach(size => {
      it(`should apply ${size} size class`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const badgeEl = debugElement.query(By.css('.badge'));
        expect(badgeEl.nativeElement).toHaveClass(`badge--${size}`);
      });
    });

    it('should default to sm size', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--sm');
    });
  });

  describe('Positioning', () => {
    const positions: BadgePosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

    positions.forEach(position => {
      it(`should apply ${position} position class when position is set`, () => {
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        const badgeEl = debugElement.query(By.css('.badge'));
        expect(badgeEl.nativeElement).toHaveClass('badge--positioned');
        expect(badgeEl.nativeElement).toHaveClass(`badge--${position}`);
      });
    });

    it('should not apply position classes when position is not set', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).not.toHaveClass('badge--positioned');
    });
  });

  describe('Icon Rendering', () => {
    it('should render icon when icon input is provided', () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();

      const iconEl = debugElement.query(By.css('app-icon'));
      expect(iconEl).toBeTruthy();
      expect(iconEl.componentInstance.name).toBe('check');
    });

    it('should add has-icon class when icon is present', () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--has-icon');
    });

    it('should not render icon when no icon input provided', () => {
      const iconEl = debugElement.query(By.css('app-icon'));
      expect(iconEl).toBeFalsy();
    });
  });

  describe('Dot Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'dot');
      fixture.detectChanges();
    });

    it('should render dot content', () => {
      const dotEl = debugElement.query(By.css('.badge__dot'));
      expect(dotEl).toBeTruthy();
    });

    it('should not render text content in dot variant', () => {
      fixture.componentRef.setInput('text', 'Should not show');
      fixture.detectChanges();

      const textEl = debugElement.query(By.css('.badge__text'));
      expect(textEl).toBeFalsy();
    });

    it('should not render icon in dot variant', () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();

      const iconEl = debugElement.query(By.css('app-icon'));
      expect(iconEl).toBeFalsy();
    });
  });

  describe('State Classes', () => {
    it('should add clickable class when clickable is true', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--clickable');
    });

    it('should add disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--disabled');
    });

    it('should add pulse class when pulse is true', () => {
      fixture.componentRef.setInput('pulse', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--pulse');
    });

    it('should add hidden class when hidden is true', () => {
      fixture.componentRef.setInput('hidden', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement).toHaveClass('badge--hidden');
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasContent correctly for text content', () => {
      expect(component.hasContent()).toBeFalsy();

      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();
      expect(component.hasContent()).toBeTruthy();
    });

    it('should compute hasContent correctly for numeric content', () => {
      fixture.componentRef.setInput('count', 0);
      fixture.detectChanges();
      expect(component.hasContent()).toBeFalsy(); // 0 count without showZero is falsy

      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();
      expect(component.hasContent()).toBeTruthy();
    });

    it('should compute hasIcon correctly', () => {
      expect(component.hasIcon()).toBeFalsy();

      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();
      expect(component.hasIcon()).toBeTruthy();
    });

    it('should compute isDot correctly', () => {
      expect(component.isDot()).toBeFalsy();

      fixture.componentRef.setInput('variant', 'dot');
      fixture.detectChanges();
      expect(component.isDot()).toBeTruthy();
    });

    it('should compute isPositioned correctly', () => {
      expect(component.isPositioned()).toBeFalsy();

      fixture.componentRef.setInput('position', 'top-right');
      fixture.detectChanges();
      expect(component.isPositioned()).toBeTruthy();
    });

    it('should compute isEmpty correctly', () => {
      // Empty by default
      expect(component.isEmpty()).toBeTruthy();

      // Has text content
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();
      expect(component.isEmpty()).toBeFalsy();

      // Has icon
      fixture.componentRef.setInput('text', '');
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();
      expect(component.isEmpty()).toBeFalsy();

      // Dot variant is never empty
      fixture.componentRef.setInput('icon', '');
      fixture.componentRef.setInput('variant', 'dot');
      fixture.detectChanges();
      expect(component.isEmpty()).toBeFalsy();
    });
  });

  describe('Event Handling', () => {
    it('should emit clicked event when clickable badge is clicked', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      badgeEl.nativeElement.click();

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled badge is clicked', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      badgeEl.nativeElement.click();

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when non-clickable badge is clicked', () => {
      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      badgeEl.nativeElement.click();

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
    });

    it('should emit clicked event on Enter key', () => {
      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      badgeEl.nativeElement.dispatchEvent(event);

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should emit clicked event on Space key', () => {
      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      const event = new KeyboardEvent('keydown', { key: ' ' });
      badgeEl.nativeElement.dispatchEvent(event);

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event on other keys', () => {
      spyOn(component.clicked, 'emit');

      const badgeEl = debugElement.query(By.css('.badge'));
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      badgeEl.nativeElement.dispatchEvent(event);

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Static Utility Methods', () => {
    describe('primary', () => {
      it('should return primary badge configuration', () => {
        const config = BadgeComponent.primary('Test');
        expect(config).toEqual({
          content: 'Test',
          variant: 'solid',
          color: 'primary',
          size: 'sm'
        });
      });

      it('should accept custom size', () => {
        const config = BadgeComponent.primary('Test', 'lg');
        expect(config.size).toBe('lg');
      });
    });

    describe('success', () => {
      it('should return success badge configuration', () => {
        const config = BadgeComponent.success('Done');
        expect(config).toEqual({
          content: 'Done',
          variant: 'solid',
          color: 'success',
          size: 'sm'
        });
      });
    });

    describe('danger', () => {
      it('should return danger badge configuration', () => {
        const config = BadgeComponent.danger('Error');
        expect(config).toEqual({
          content: 'Error',
          variant: 'solid',
          color: 'danger',
          size: 'sm'
        });
      });
    });

    describe('warning', () => {
      it('should return warning badge configuration', () => {
        const config = BadgeComponent.warning('Warning');
        expect(config).toEqual({
          content: 'Warning',
          variant: 'solid',
          color: 'warning',
          size: 'sm'
        });
      });
    });

    describe('dot', () => {
      it('should return dot badge configuration', () => {
        const config = BadgeComponent.dot('primary');
        expect(config).toEqual({
          variant: 'dot',
          color: 'primary',
          size: 'sm'
        });
      });

      it('should accept custom size', () => {
        const config = BadgeComponent.dot('primary', 'md');
        expect(config.size).toBe('md');
      });
    });

    describe('count', () => {
      it('should return count badge configuration', () => {
        const config = BadgeComponent.count(5);
        expect(config).toEqual({
          content: 5,
          variant: 'solid',
          color: 'danger',
          size: 'xs'
        });
      });

      it('should handle zero count', () => {
        const config = BadgeComponent.count(0);
        expect(config.content).toBe(0);
      });
    });

    describe('notification', () => {
      it('should return notification badge configuration', () => {
        const config = BadgeComponent.notification(3, 'top-right');
        expect(config).toEqual({
          content: 3,
          variant: 'solid',
          color: 'danger',
          size: 'xs',
          position: 'top-right'
        });
      });

      it('should handle zero notifications', () => {
        const config = BadgeComponent.notification(0, 'top-right');
        expect(config.content).toBe(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper tabindex when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper role when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement.getAttribute('role')).toBe('button');
    });

    it('should not have interactive attributes when not clickable', () => {
      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement.getAttribute('tabindex')).toBeNull();
      expect(badgeEl.nativeElement.getAttribute('role')).toBeNull();
    });

    it('should have aria-disabled when disabled', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const badgeEl = debugElement.query(By.css('.badge'));
      expect(badgeEl.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });
  });
});