import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { environment } from '@env/environment';
import { AppCategoryService } from './app-category.service';
import { PagedResult } from '@interfaces/aaa';
import { AppCategory } from '@interfaces/app-category.interface';

describe('AppCategoryService', () => {
  let service: AppCategoryService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/app-categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppCategoryService,
      ],
    });
    service = TestBed.inject(AppCategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('search() maps SearchParams to PascalCase query params', () => {
    const result: PagedResult<AppCategory> = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 };
    service.search({ pageNumber: 2, pageSize: 10, searchString: 'crm', sortColumn: 'name', sortOrder: 'asc' })
      .subscribe(r => expect(r).toEqual(result));
    const req = http.expectOne(r => r.url === base);
    expect(req.request.params.get('PageNumber')).toBe('2');
    expect(req.request.params.get('PageSize')).toBe('10');
    expect(req.request.params.get('SearchString')).toBe('crm');
    expect(req.request.params.get('SortColumn')).toBe('name');
    expect(req.request.params.get('SortOrder')).toBe('asc');
    req.flush(result);
  });

  it('getByCode() GETs /{code}', () => {
    service.getByCode('CRM').subscribe();
    http.expectOne(`${base}/CRM`).flush({ code: 'CRM', name: 'CRM', status: 'ACTIVE' });
  });

  it('create() POSTs the dto', () => {
    service.create({ code: 'CRM', name: 'CRM' }).subscribe();
    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush({ code: 'CRM', name: 'CRM', status: 'ACTIVE' });
  });

  it('update() PUTs /{code}', () => {
    service.update('CRM', { name: 'Sales' }).subscribe();
    const req = http.expectOne(`${base}/CRM`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('updateStatus() PUTs /{code}/status', () => {
    service.updateStatus('CRM', { status: 'inactive' }).subscribe();
    const req = http.expectOne(`${base}/CRM/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'inactive' });
    req.flush(null);
  });

  it('delete() DELETEs /{code}', () => {
    service.delete('CRM').subscribe();
    const req = http.expectOne(`${base}/CRM`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
