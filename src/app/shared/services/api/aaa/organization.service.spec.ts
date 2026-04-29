import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrganizationService } from './organization.service';
import { Organization, PagedResult, PaginatedList } from '@interfaces/aaa';
import { environment } from '@env/environment';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let http: HttpTestingController;
  const baseUrl = `${environment.authUrl}/v1/organizations`;

  const org: Organization = {
    id: 'abc-1',
    name: 'Acme',
    ownerId: 'owner-1',
    ownerName: 'Ada Lovelace',
    status: 'Active',
    serviceTeamId: 'svc-1',
    email: null,
    phone: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrganizationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll normalises a PagedResult response to PaginatedList (staging shape)', done => {
    const server: PagedResult<Organization> = {
      items: [org],
      totalCount: 2,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    };
    service.getAll({ pageNumber: 1, pageSize: 10 }).subscribe(page => {
      expect(page.items).toEqual([org]);
      expect(page.totalItems).toBe(2);
      expect(page.pageIndex).toBe(1);
      expect(page.totalPages).toBe(1);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush(server);
  });

  it('getAll normalises a flat array response to PaginatedList', done => {
    service.getAll({ pageNumber: 1, pageSize: 10 }).subscribe(page => {
      expect(page.items).toEqual([org]);
      expect(page.totalItems).toBe(1);
      expect(page.pageIndex).toBe(1);
      expect(page.totalPages).toBe(1);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush([org]);
  });

  it('getAll passes through a PaginatedList response unchanged', done => {
    const paged: PaginatedList<Organization> = {
      items: [org],
      totalItems: 42,
      pageIndex: 3,
      totalPages: 5
    };
    service.getAll({ pageNumber: 3, pageSize: 10 }).subscribe(page => {
      expect(page).toEqual(paged);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush(paged);
  });

  it('getById hits /v1/organizations/{id}', done => {
    service.getById('abc-1').subscribe(result => {
      expect(result.name).toBe('Acme');
      expect(result.ownerName).toBe('Ada Lovelace');
      done();
    });
    http.expectOne(`${baseUrl}/abc-1`).flush(org);
  });

  it('getInstances normalises a PagedResult<Instance> response', done => {
    service.getInstances('abc-1', { pageNumber: 1, pageSize: 50 }).subscribe(page => {
      expect(page.items.length).toBe(2);
      expect(page.totalItems).toBe(2);
      done();
    });
    http
      .expectOne(r => r.url === `${baseUrl}/abc-1/instances`)
      .flush({
        items: [
          { id: 'i1', name: 'Inst 1' },
          { id: 'i2', name: 'Inst 2' }
        ],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 50,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      });
  });
});
