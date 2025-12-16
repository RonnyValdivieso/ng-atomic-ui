import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle';
import { ThemeService } from '../../../shared/services/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    const initialTheme = themeService.isDarkMode();
    
    button.click();
    fixture.detectChanges();
    
    expect(themeService.isDarkMode()).toBe(!initialTheme);
  });

  it('should display sun icon in light mode', () => {
    themeService.setTheme(false);
    fixture.detectChanges();
    
    const sunIcon = fixture.nativeElement.querySelector('.pi-sun');
    expect(sunIcon.classList.contains('opacity-100')).toBe(true);
  });

  it('should display moon icon in dark mode', () => {
    themeService.setTheme(true);
    fixture.detectChanges();
    
    const moonIcon = fixture.nativeElement.querySelector('.pi-moon');
    expect(moonIcon.classList.contains('opacity-100')).toBe(true);
  });

  it('should have proper aria-label', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
