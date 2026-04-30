import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { RoleService } from './role.service';
import { PaginatedList, Role } from '@interfaces/aaa';
import { environment } from '@env/environment';

describe('RoleService', () => {
  let service: RoleService;
  let http: HttpTestingController;
  const baseUrl = `${environment.authUrl}/v1/roles`;
  const role: Role = {
    id: 'r-1',
    name: 'Admin',
    instanceId: '00000000-0000-0000-0000-000000000000',
    status: 'ACTIVE',
    permissionCount: 163,
    moduleCount: 39
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RoleService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll passes through the PaginatedList shape', done => {
    const paged: PaginatedList<Role> = {
      items: [role],
      totalItems: 12,
      pageIndex: 1,
      totalPages: 4
    };
    service.getAll({ pageNumber: 1, pageSize: 3 }).subscribe(page => {
      expect(page.items).toEqual([role]);
      expect(page.totalItems).toBe(12);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush(paged);
  });

  it('CRUD round-trip', done => {
    service.create({ name: 'Tester' }).subscribe(() => {
      service.update('r-1', { name: 'Tester2' }).subscribe(() => {
        service.delete('r-1').subscribe(() => done());
        http.expectOne(`${baseUrl}/r-1`).flush(null);
      });
      http.expectOne(`${baseUrl}/r-1`).flush(null);
    });
    http.expectOne(baseUrl).flush({ id: 'r-1', name: 'Tester', instanceId: '0', status: 'ACTIVE' });
  });
});
