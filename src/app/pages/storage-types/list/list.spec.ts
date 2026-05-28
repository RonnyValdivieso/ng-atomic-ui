import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StorageTypesComponent } from './list';
import { AIStorageTypeService } from '@services/api/ai-storage-type.service';

describe('StorageTypesComponent', () => {
  let component: StorageTypesComponent;
  let fixture: ComponentFixture<StorageTypesComponent>;
  let mockService: jasmine.SpyObj<AIStorageTypeService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AIStorageTypeService', ['getAll', 'create', 'update', 'delete']);
    mockService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [StorageTypesComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        { provide: AIStorageTypeService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StorageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
