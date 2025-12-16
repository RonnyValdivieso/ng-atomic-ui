import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AvatarComponent } from './avatar';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      expect(component.src()).toBe('');
      expect(component.alt()).toBe('');
      expect(component.initials()).toBe('');
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('circular');
      expect(component.status()).toBe('none');
      expect(component.clickable()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
    });

    it('should apply correct CSS classes', () => {
      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement).toBeTruthy();
      expect(avatarElement?.classList).toContain('avatar--md');
      expect(avatarElement?.classList).toContain('avatar--circular');
      expect(avatarElement?.classList).toContain('avatar--placeholder');
    });
  });

  describe('Avatar Image', () => {
    it('should display image when src is provided', async () => {
      fixture.componentRef.setInput('src', '/assets/user.jpg');
      fixture.componentRef.setInput('alt', 'John Doe');
      fixture.detectChanges();

      const image = compiled.querySelector('.avatar__image');
      expect(image).toBeTruthy();
      expect(image?.getAttribute('src')).toBe('/assets/user.jpg');
      expect(image?.getAttribute('alt')).toBe('John Doe');
    });

    it('should handle image load event', () => {
      const imageLoadedSpy = jasmine.createSpy('imageLoaded');
      component.imageLoaded.subscribe(imageLoadedSpy);

      fixture.componentRef.setInput('src', '/assets/user.jpg');
      fixture.detectChanges();

      const image = compiled.querySelector('.avatar__image') as HTMLImageElement;
      image?.dispatchEvent(new Event('load'));

      expect(imageLoadedSpy).toHaveBeenCalled();
    });

    it('should handle image error event', () => {
      const imageErrorSpy = jasmine.createSpy('imageError');
      component.imageError.subscribe(imageErrorSpy);

      fixture.componentRef.setInput('src', '/invalid/path.jpg');
      fixture.detectChanges();

      const image = compiled.querySelector('.avatar__image') as HTMLImageElement;
      image?.dispatchEvent(new Event('error'));

      expect(imageErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Avatar Initials', () => {
    it('should display initials when provided', () => {
      fixture.componentRef.setInput('initials', 'John Doe');
      fixture.detectChanges();

      const initials = compiled.querySelector('.avatar__initials .avatar__text');
      expect(initials).toBeTruthy();
      expect(initials?.textContent?.trim()).toBe('JD');
    });

    it('should display single name initials correctly', () => {
      fixture.componentRef.setInput('initials', 'John');
      fixture.detectChanges();

      const initials = compiled.querySelector('.avatar__initials .avatar__text');
      expect(initials?.textContent?.trim()).toBe('JO');
    });

    it('should apply initials CSS class', () => {
      fixture.componentRef.setInput('initials', 'JD');
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.classList).toContain('avatar--has-initials');
    });
  });

  describe('Avatar Placeholder', () => {
    it('should show placeholder icon when no image or initials', () => {
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.avatar__placeholder');
      const icon = compiled.querySelector('app-icon');
      expect(placeholder).toBeTruthy();
      expect(icon).toBeTruthy();
    });

    it('should show custom placeholder text', () => {
      fixture.componentRef.setInput('placeholder', 'User');
      fixture.detectChanges();

      const placeholderText = compiled.querySelector('.avatar__placeholder .avatar__text');
      expect(placeholderText?.textContent?.trim()).toBe('User');
    });
  });

  describe('Avatar Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    sizes.forEach(size => {
      it(`should apply correct class for ${size} size`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const avatarElement = compiled.querySelector('.avatar');
        expect(avatarElement?.classList).toContain(`avatar--${size}`);
      });
    });
  });

  describe('Avatar Variants', () => {
    const variants = ['circular', 'rounded', 'square'] as const;

    variants.forEach(variant => {
      it(`should apply correct class for ${variant} variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const avatarElement = compiled.querySelector('.avatar');
        expect(avatarElement?.classList).toContain(`avatar--${variant}`);
      });
    });
  });

  describe('Avatar Status', () => {
    const statuses = ['online', 'offline', 'away', 'busy'] as const;

    statuses.forEach(status => {
      it(`should show status indicator for ${status} status`, () => {
        fixture.componentRef.setInput('status', status);
        fixture.detectChanges();

        const statusElement = compiled.querySelector('.avatar__status');
        expect(statusElement).toBeTruthy();
        expect(statusElement?.classList).toContain(`avatar__status--${status}`);
      });
    });

    it('should not show status indicator when status is none', () => {
      fixture.componentRef.setInput('status', 'none');
      fixture.detectChanges();

      const statusElement = compiled.querySelector('.avatar__status');
      expect(statusElement).toBeFalsy();
    });
  });

  describe('Avatar Interactions', () => {
    it('should emit clicked event when clickable and clicked', () => {
      const clickedSpy = jasmine.createSpy('clicked');
      component.clicked.subscribe(clickedSpy);

      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      avatarElement?.dispatchEvent(new Event('click'));

      expect(clickedSpy).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      const clickedSpy = jasmine.createSpy('clicked');
      component.clicked.subscribe(clickedSpy);

      fixture.componentRef.setInput('clickable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      avatarElement?.dispatchEvent(new Event('click'));

      expect(clickedSpy).not.toHaveBeenCalled();
    });

    it('should handle keyboard events when clickable', () => {
      const clickedSpy = jasmine.createSpy('clicked');
      component.clicked.subscribe(clickedSpy);

      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      avatarElement?.dispatchEvent(enterEvent);

      expect(clickedSpy).toHaveBeenCalled();
    });

    it('should apply clickable class and attributes', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.classList).toContain('avatar--clickable');
      expect(avatarElement?.getAttribute('role')).toBe('button');
      expect(avatarElement?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loadingElement = compiled.querySelector('.avatar__loading');
      const spinner = compiled.querySelector('app-icon[name="pi-spinner"]');
      expect(loadingElement).toBeTruthy();
      expect(spinner).toBeTruthy();
    });

    it('should apply loading class', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.classList).toContain('avatar--loading');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      fixture.componentRef.setInput('alt', 'John Doe Profile');
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.getAttribute('aria-label')).toBe('John Doe Profile');
    });

    it('should have default aria-label when no alt provided', () => {
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.getAttribute('aria-label')).toBe('User avatar');
    });

    it('should set aria-disabled when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const avatarElement = compiled.querySelector('.avatar');
      expect(avatarElement?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Static Methods', () => {
    it('should generate correct initials from full name', () => {
      expect(AvatarComponent.generateInitials('John Doe')).toBe('JD');
      expect(AvatarComponent.generateInitials('John')).toBe('JO');
      expect(AvatarComponent.generateInitials('John Middle Doe')).toBe('JM');
      expect(AvatarComponent.generateInitials('')).toBe('');
    });

    it('should return correct status colors', () => {
      expect(AvatarComponent.getStatusColor('online')).toBe('#10b981');
      expect(AvatarComponent.getStatusColor('offline')).toBe('#6b7280');
      expect(AvatarComponent.getStatusColor('away')).toBe('#f59e0b');
      expect(AvatarComponent.getStatusColor('busy')).toBe('#ef4444');
      expect(AvatarComponent.getStatusColor('none')).toBe('transparent');
    });

    it('should validate image URLs correctly', () => {
      expect(AvatarComponent.isValidImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(AvatarComponent.isValidImageUrl('https://example.com/image.png')).toBe(true);
      expect(AvatarComponent.isValidImageUrl('invalid-url')).toBe(false);
      expect(AvatarComponent.isValidImageUrl('https://example.com/file.txt')).toBe(false);
    });
  });
});