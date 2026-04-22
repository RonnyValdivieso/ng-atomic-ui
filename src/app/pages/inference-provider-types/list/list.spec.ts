import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { InferenceProviderTypesComponent } from './list';
import { AIProviderTypeService } from '@services/api/ai-provider-type.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AIProviderType } from '@interfaces/ai-provider-type.interface';

describe('InferenceProviderTypesComponent', () => {
  let component: InferenceProviderTypesComponent;
  let fixture: ComponentFixture<InferenceProviderTypesComponent>;
  let mockService: jasmine.SpyObj<AIProviderTypeService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AIProviderTypeService', ['getAll', 'create', 'update', 'delete']);
    
    // Provide dummy data so the table has a row
    const dummyTypes: AIProviderType[] = [
      { code: 'S3', name: 'Amazon S3', description: 'AWS S3 Storage' }
    ];
    mockService.getAll.and.returnValue(of(dummyTypes));

    await TestBed.configureTestingModule({
      imports: [InferenceProviderTypesComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        { provide: AIProviderTypeService, useValue: mockService },
        provideRouter([]) // Provide router for `viewDetails` navigation
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InferenceProviderTypesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable(); // Await stable before detectChanges to ensure app loads
    fixture.detectChanges(); // Trigger initial data load
  });

  it('should render the three action buttons (Visibility, Edit, Delete) correctly for a row', async () => {
    // Ensure any signals or asynchronous template updates settle
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges(); // Wait a second cycle for nested queries
    await fixture.whenStable();

    // Query the data table rows
    const rows = fixture.debugElement.queryAll(By.css('.p-datatable-tbody > tr'));
    expect(rows.length).toBeGreaterThan(0, 'Table should have rendered at least one row');

    // Query for the app-button instances within the first row's actions column (or just the row)
    const actionButtons = rows[0].queryAll(By.css('app-button'));
    
    // Using filter to ensure we get the buttons that map to the actions
    // Since there might be other buttons depending on template, we check their icons.
    const icons = actionButtons.map(btn => btn.componentInstance.icon() || btn.componentInstance.icon);

    expect(icons).toContain('visibility');
    expect(icons).toContain('edit');
    expect(icons).toContain('delete');
  });
});
