import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LabelComponent } from './label';

// Test host component for testing inputs
@Component({
  template: `
    <app-label 
      [text]="text"
      [for]="for"
      [size]="size"
      [variant]="variant"
      [required]="required"
      [disabled]="disabled">
      <span class="projected-content">Projected Content</span>
    </app-label>
  `
})
class TestHostComponent {
  text = 'Test Label';
  for = 'test-input';
  size: 'small' | 'medium' | 'large' = 'medium';
  variant: 'default' | 'secondary' | 'accent' = 'default';
  required = false;
  disabled = false;
}

describe('LabelComponent', () => {
  let component: LabelComponent;
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelComponent],
      declarations: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    
    const labelDebugElement = fixture.debugElement.query(By.directive(LabelComponent));
    component = labelDebugElement.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should display the text content', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      const textSpan = labelElement.query(By.css('.label__text'));
      
      expect(textSpan.nativeElement.textContent.trim()).toBe('Test Label');
    });

    it('should render without text when text input is empty', () => {
      hostComponent.text = '';
      fixture.detectChanges();
      
      const textSpan = fixture.debugElement.query(By.css('.label__text'));
      expect(textSpan).toBeNull();
    });

    it('should project content correctly', () => {
      const projectedContent = fixture.debugElement.query(By.css('.projected-content'));
      expect(projectedContent).toBeTruthy();
      expect(projectedContent.nativeElement.textContent.trim()).toBe('Projected Content');
    });
  });

  describe('Accessibility', () => {
    it('should set correct for attribute', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.getAttribute('for')).toBe('test-input');
    });

    it('should have aria-label for required fields', () => {
      hostComponent.required = true;
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.getAttribute('aria-label')).toBe('Test Label (required)');
    });

    it('should have aria-label for normal fields', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.getAttribute('aria-label')).toBe('Test Label');
    });

    it('should show required indicator when required is true', () => {
      hostComponent.required = true;
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('.label__required'));
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.nativeElement.textContent.trim()).toBe('*');
      expect(requiredSpan.nativeElement.getAttribute('aria-label')).toBe('required');
    });

    it('should not show required indicator when required is false', () => {
      hostComponent.required = false;
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('.label__required'));
      expect(requiredSpan).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    it('should apply default size class', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement).toHaveClass('label--medium');
    });

    it('should apply correct size classes', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      
      // Test small size
      hostComponent.size = 'small';
      fixture.detectChanges();
      expect(labelElement.nativeElement).toHaveClass('label--small');
      
      // Test large size
      hostComponent.size = 'large';
      fixture.detectChanges();
      expect(labelElement.nativeElement).toHaveClass('label--large');
    });

    it('should apply variant classes', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      
      // Test secondary variant
      hostComponent.variant = 'secondary';
      fixture.detectChanges();
      expect(labelElement.nativeElement).toHaveClass('label--secondary');
      
      // Test accent variant
      hostComponent.variant = 'accent';
      fixture.detectChanges();
      expect(labelElement.nativeElement).toHaveClass('label--accent');
    });

    it('should apply disabled class when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement).toHaveClass('label--disabled');
    });

    it('should apply required class when required', () => {
      hostComponent.required = true;
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement).toHaveClass('label--required');
    });

    it('should always have base label class', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement).toHaveClass('label');
    });
  });

  describe('Behavior Validation', () => {
    it('should conditionally render text span based on text input', () => {
      // Text exists
      let textSpan = fixture.debugElement.query(By.css('.label__text'));
      expect(textSpan).toBeTruthy();
      
      // No text
      hostComponent.text = '';
      fixture.detectChanges();
      textSpan = fixture.debugElement.query(By.css('.label__text'));
      expect(textSpan).toBeNull();
    });

    it('should generate unique id attribute', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      const labelId = labelElement.nativeElement.getAttribute('id');
      expect(labelId).toMatch(/^label-[a-z0-9]{7}$/);
    });

    it('should have different ids for multiple instances', () => {
      const secondFixture = TestBed.createComponent(TestHostComponent);
      secondFixture.detectChanges();
      
      const firstLabelId = fixture.debugElement.query(By.css('label')).nativeElement.getAttribute('id');
      const secondLabelId = secondFixture.debugElement.query(By.css('label')).nativeElement.getAttribute('id');
      
      expect(firstLabelId).not.toBe(secondLabelId);
    });
  });

  describe('Component Inputs', () => {
    it('should accept text input', () => {
      expect(component.text()).toBe('Test Label');
    });

    it('should accept for input', () => {
      expect(component.for()).toBe('test-input');
    });

    it('should accept size input with default', () => {
      expect(component.size()).toBe('medium');
    });

    it('should accept variant input with default', () => {
      expect(component.variant()).toBe('default');
    });

    it('should accept required input with default', () => {
      expect(component.required()).toBe(false);
    });

    it('should accept disabled input with default', () => {
      expect(component.disabled()).toBe(false);
    });
  });
});