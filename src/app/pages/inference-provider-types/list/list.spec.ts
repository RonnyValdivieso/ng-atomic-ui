import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { InferenceProviderTypesComponent } from './list';
import { AIProviderTypeService } from '@services/api/ai-provider-type.service';
import { AIProviderType } from '@interfaces/ai-provider-type.interface';

describe('InferenceProviderTypesComponent', () => {
  let fixture: ComponentFixture<InferenceProviderTypesComponent>;
  let mockService: jasmine.SpyObj<AIProviderTypeService>;

  const dummy: AIProviderType[] = [
    { code: 'S3', name: 'Amazon S3', description: 'AWS S3 Storage' }
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AIProviderTypeService', ['getAll', 'create', 'update', 'delete']);
    mockService.getAll.and.returnValue(of(dummy));

    await TestBed.configureTestingModule({
      imports: [InferenceProviderTypesComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        { provide: AIProviderTypeService, useValue: mockService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InferenceProviderTypesComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders a row with the type name and Edit/Delete row actions', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('table.tbl tbody tr'));
    expect(rows.length).toBeGreaterThan(0);

    const nameTitle = rows[0].query(By.css('.name-title'));
    expect(nameTitle?.nativeElement.textContent).toContain('Amazon S3');

    const actionLabels = rows[0]
      .queryAll(By.css('.row-actions button'))
      .map(b => b.nativeElement.getAttribute('aria-label'));
    expect(actionLabels).toContain('Edit');
    expect(actionLabels).toContain('Delete');
  });
});
