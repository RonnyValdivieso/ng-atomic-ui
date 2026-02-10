import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormFieldComponent } from './form-field';
import { Component, provideZonelessChangeDetection } from '@angular/core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form">
      <app-form-field 
        formControlName="email"
        label="Email"
        [required]="true"
        [errorMessage]="errorMessage">
      </app-form-field>
    </form>
  `
})
class TestHostComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  errorMessage = '';
}

describe('FormFieldComponent Integration', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update form control value when input changes', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();

    expect(component.form.get('email')?.value).toBe('test@example.com');
  });

  it('should update input value when form control changes', () => {
    component.form.get('email')?.setValue('new@example.com');
    
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('new@example.com');
  });

  it('should show error message when touched and invalid', () => {
    component.form.get('email')?.markAsTouched();
    component.errorMessage = 'Invalid email';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.form-field__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Invalid email');
  });
});
