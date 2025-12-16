import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      expect(component.placeholder()).toBe('Search...');
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.debounceTime()).toBe(300);
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.clearable()).toBe(true);
      expect(component.showSearchButton()).toBe(false);
    });

    it('should render search input with correct attributes', () => {
      const input = compiled.querySelector('app-input');
      expect(input).toBeTruthy();
      expect(input?.getAttribute('type')).toBe('search');
      expect(input?.getAttribute('aria-label')).toBe('Search input');
    });

    it('should render search icon', () => {
      const searchIcon = compiled.querySelector('.search-box__search-icon i.pi-search');
      expect(searchIcon).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    it('should emit searchChanged event with debounce', fakeAsync(() => {
      const searchChangedSpy = jasmine.createSpy('searchChanged');
      component.searchChanged.subscribe(searchChangedSpy);

      // Simulate typing through form control
      component.searchControl.setValue('test query');
      tick(300); // Wait for debounce

      expect(searchChangedSpy).toHaveBeenCalledWith('test query');
    }));

    it('should not emit searchChanged for empty strings', fakeAsync(() => {
      const searchChangedSpy = jasmine.createSpy('searchChanged');
      component.searchChanged.subscribe(searchChangedSpy);

      component.searchControl.setValue('   '); // Only spaces
      tick(300);

      expect(searchChangedSpy).toHaveBeenCalledWith(''); // Trimmed empty string
    }));

    it('should clear search through public method', () => {
      const searchClearedSpy = jasmine.createSpy('searchCleared');
      component.searchCleared.subscribe(searchClearedSpy);

      component.searchControl.setValue('test query');
      component.clear(); // Use public method

      expect(component.searchControl.value).toBe('');
      expect(searchClearedSpy).toHaveBeenCalled();
    });
  });

  describe('Clear Button', () => {
    it('should show clear button when has search term and clearable is true', () => {
      component.searchControl.setValue('test');
      fixture.detectChanges();

      const clearButton = compiled.querySelector('.search-box__clear-button');
      expect(clearButton).toBeTruthy();
    });

    it('should hide clear button when clearable is false', async () => {
      fixture.componentRef.setInput('clearable', false);
      component.searchControl.setValue('test');
      fixture.detectChanges();

      const clearButton = compiled.querySelector('.search-box__clear-button');
      expect(clearButton).toBeFalsy();
    });

    it('should clear search when using public clear method', () => {
      const searchClearedSpy = jasmine.createSpy('searchCleared');
      component.searchCleared.subscribe(searchClearedSpy);

      component.searchControl.setValue('test query');
      component.clear();

      expect(component.searchControl.value).toBe('');
      expect(searchClearedSpy).toHaveBeenCalled();
    });
  });

  describe('Search Button', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('showSearchButton', true);
      fixture.detectChanges();
    });

    it('should show search button when showSearchButton is true', () => {
      const searchButton = compiled.querySelector('.search-box__search-button');
      expect(searchButton).toBeTruthy();
    });

    it('should disable search button when no search term', () => {
      component.searchControl.setValue('');
      fixture.detectChanges();

      const searchButton = compiled.querySelector('app-button.search-box__search-button');
      expect(searchButton).toBeTruthy();
    });

    it('should have search button with correct attributes', () => {
      component.searchControl.setValue('test query');
      fixture.detectChanges();

      const searchButton = compiled.querySelector('.search-box__search-button');
      expect(searchButton).toBeTruthy();
      expect(searchButton?.getAttribute('aria-label')).toBe('Search');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
    });

    it('should show loading icon when loading is true', () => {
      const loadingIcon = compiled.querySelector('.search-box__search-icon i.pi-spinner');
      expect(loadingIcon).toBeTruthy();
    });

    it('should show loading icon instead of search icon', () => {
      const loadingIcon = compiled.querySelector('.search-box__search-icon i.pi-spinner');
      const searchIcon = compiled.querySelector('.search-box__search-icon i.pi-search');
      
      expect(loadingIcon).toBeTruthy();
      expect(searchIcon).toBeFalsy();
    });

    it('should hide clear button when loading', () => {
      component.searchControl.setValue('test');
      fixture.detectChanges();

      const clearButton = compiled.querySelector('.search-box__clear-button');
      expect(clearButton).toBeFalsy();
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
    });

    it('should apply disabled class', () => {
      const container = compiled.querySelector('.search-box--disabled');
      expect(container).toBeTruthy();
    });

    it('should have disabled input when disabled', () => {
      const input = compiled.querySelector('app-input');
      expect(input?.getAttribute('ng-reflect-disabled')).toBe('true');
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = compiled.querySelector('.search-box--small');
      expect(container).toBeTruthy();
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = compiled.querySelector('.search-box--large');
      expect(container).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const input = compiled.querySelector('app-input');
      expect(input?.getAttribute('aria-label')).toBe('Search input');
    });

    it('should have screen reader announcements', () => {
      const srElement = compiled.querySelector('.search-box__sr-only');
      expect(srElement).toBeTruthy();
      expect(srElement?.getAttribute('aria-live')).toBe('polite');
    });

    it('should announce loading state to screen readers', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const srElement = compiled.querySelector('.search-box__sr-only');
      expect(srElement?.textContent?.trim()).toBe('Searching...');
    });
  });

  describe('Public API', () => {
    it('should clear search through public method', () => {
      component.searchControl.setValue('test');
      component.clear();

      expect(component.searchControl.value).toBe('');
    });

    it('should set value through public method', () => {
      component.setValue('new value');
      expect(component.searchControl.value).toBe('new value');
    });
  });
});