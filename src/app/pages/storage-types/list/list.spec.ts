import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageTypesComponent } from './list';
import { AIStorageTypeService } from '@services/api/ai-storage-type.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('StorageTypesComponent', () => {
  let component: StorageTypesComponent;
  let fixture: ComponentFixture<StorageTypesComponent>;
  let mockService: jasmine.SpyObj<AIStorageTypeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AIStorageTypeService', ['getAll', 'create', 'update', 'delete']);
    mockService.getAll.and.returnValue(of([]));
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [StorageTypesComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AIStorageTypeService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StorageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
