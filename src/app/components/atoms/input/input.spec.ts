import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input';
import { provideZonelessChangeDetection } from '@angular/core';

describe('InputComponent', () => {
	let component: InputComponent;
	let fixture: ComponentFixture<InputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InputComponent], // ✅ imports for standalone component
			providers: [provideZonelessChangeDetection()]
		}).compileComponents();

		fixture = TestBed.createComponent(InputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render with default properties', () => {
		const input = fixture.nativeElement.querySelector('input');

		expect(input).toBeTruthy();
		expect(input.type).toBe('text');
		expect(input.placeholder).toBe('Enter a value');
		expect(input.disabled).toBe(false);
		expect(input.readOnly).toBe(false);
	});

	it('should update value when input changes', () => {
		const input = fixture.nativeElement.querySelector('input');

		input.value = 'test value';
		input.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		expect(component.value()).toBe('test value');
	});

	it('should handle focus and blur events', () => {
		const input = fixture.nativeElement.querySelector('input');

		// Test focus
		input.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		expect(input.className).toContain('input--focused');

		// Test blur
		input.dispatchEvent(new Event('blur'));
		fixture.detectChanges();
		expect(input.className).not.toContain('input--focused');
	});

	it('should apply size variants correctly', () => {
		// Test small size
		fixture.componentRef.setInput('size', 'small');
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');
		expect(input.className).toContain('input--small');

		// Test large size
		fixture.componentRef.setInput('size', 'large');
		fixture.detectChanges();
		expect(input.className).toContain('input--large');
	});

	it('should handle different input types', () => {
		fixture.componentRef.setInput('type', 'email');
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');
		expect(input.type).toBe('email');
	});

	it('should handle disabled state', () => {
		// Set disabled through ControlValueAccessor
		component.setDisabledState(true);
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');
		expect(input.disabled).toBe(true);
		expect(input.className).toContain('input--disabled');
	});

	it('should handle readonly state', () => {
		fixture.componentRef.setInput('readonly', true);
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');
		expect(input.readOnly).toBe(true);
		expect(input.className).toContain('input--readonly');
	});

	it('should work with ControlValueAccessor', () => {
		const testValue = 'control value test';

		// Test writeValue
		component.writeValue(testValue);
		expect(component.value()).toBe(testValue);

		// Test registerOnChange
		let changedValue = '';
		component.registerOnChange((value) => {
			changedValue = value;
		});

		const inputElem = fixture.nativeElement.querySelector('input');
		inputElem.value = 'new value';
		inputElem.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(changedValue).toBe('new value');

		// Test registerOnTouched
		let touched = false;
		component.registerOnTouched(() => {
			touched = true;
		});

		const input = fixture.nativeElement.querySelector('input');
		input.dispatchEvent(new Event('blur'));
		expect(touched).toBe(true);
	});

	it('should support default value via property binding', () => {
		fixture.componentRef.setInput('value', 'initial value');
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');
		expect(input.value).toBe('initial value');
		expect(component.value()).toBe('initial value');
	});

	it('should have proper accessibility attributes', () => {
		fixture.componentRef.setInput('placeholder', 'Enter email');
		fixture.detectChanges();

		const input = fixture.nativeElement.querySelector('input');

		expect(input.getAttribute('title')).toBe('Enter email');
		expect(input.getAttribute('placeholder')).toBe('Enter email');
		expect(input.hasAttribute('id')).toBe(true);
	});
});