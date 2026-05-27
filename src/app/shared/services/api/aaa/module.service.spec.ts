import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ModuleService } from './module.service';
import { Module, PagedResult } from '@interfaces/aaa';
import { environment } from '@env/environment';

describe('ModuleService', () => {
  let service: ModuleService;
  let http: HttpTestingController;
  const baseUrl = `${environment.authUrl}/v1/modules`;
  const mod: Module = { id: 'm-1', name: 'AIAgents', status: 'ACTIVE' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ModuleService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll normalises a PagedResult response to PaginatedList', done => {
    const paged: PagedResult<Module> = {
      items: [mod],
      totalCount: 43,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false
    };
    service.getAll({ pageNumber: 1, pageSize: 10 }).subscribe(page => {
      expect(page.items).toEqual([mod]);
      expect(page.totalItems).toBe(43);
      expect(page.pageIndex).toBe(1);
      expect(page.totalPages).toBe(5);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush(paged);
  });

  it('getAll handles a flat array response', done => {
    service.getAll({ pageNumber: 1, pageSize: 10 }).subscribe(page => {
      expect(page.items).toEqual([mod]);
      expect(page.totalItems).toBe(1);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush([mod]);
  });

  it('getById hits /v1/modules/{id}', done => {
    service.getById('m-1').subscribe(result => {
      expect(result.name).toBe('AIAgents');
      done();
    });
    http.expectOne(`${baseUrl}/m-1`).flush(mod);
  });

  it('getPermissions extracts the nested permissions array from the wrapper', done => {
    service.getPermissions('m-1').subscribe(perms => {
      expect(perms.length).toBe(2);
      expect(perms[0].description).toBe('view');
      expect(perms[0].value).toBe('AIAgentsView');
      done();
    });
    http.expectOne(`${baseUrl}/m-1/permissions`).flush({
      id: 'm-1',
      name: 'AIAgents',
      permissions: [
        { id: 'p-1', description: 'view', value: 'AIAgentsView' },
        { id: 'p-2', description: 'create', value: 'AIAgentsCreate' }
      ]
    });
  });

  it('CRUD round-trip', done => {
    service.create({ name: 'Foo' }).subscribe(() => {
      service.update('m-1', { name: 'Bar' }).subscribe(() => {
        service.delete('m-1').subscribe(() => done());
        http.expectOne(`${baseUrl}/m-1`).flush(null);
      });
      http.expectOne(`${baseUrl}/m-1`).flush(null);
    });
    http.expectOne(baseUrl).flush({ id: 'm-2', name: 'Foo', status: 'ACTIVE' });
  });
});
