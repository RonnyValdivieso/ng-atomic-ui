import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent], // ✅ imports for standalone component
      providers: [provideAnimations()] // ✅ Required for PrimeNG
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when button is clicked and not disabled', () => {
    spyOn(component.clicked, 'emit');
    
    // ✅ Use fixture.componentRef.setInput for signals
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('p-button');
    buttonElement.click();
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    spyOn(component.clicked, 'emit');
    
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('p-button');
    buttonElement.click();
    
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should not emit clicked event when loading', () => {
    spyOn(component.clicked, 'emit');
    
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('p-button');
    buttonElement.click();
    
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should render PrimeNG button with correct attributes', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    
    const buttonElement = fixture.nativeElement.querySelector('p-button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.getAttribute('ng-reflect-severity')).toBe('primary');
    expect(buttonElement.getAttribute('ng-reflect-size')).toBe('large');
    expect(buttonElement.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should support icon input', () => {
    fixture.componentRef.setInput('icon', 'pi pi-save');
    fixture.detectChanges();
    
    const buttonElement = fixture.nativeElement.querySelector('p-button');
    expect(buttonElement.getAttribute('ng-reflect-icon')).toBe('pi pi-save');
  });

  it('should have correct accessibility attributes', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    
    expect(button.getAttribute('aria-label')).toBe('Loading...');
  });
});