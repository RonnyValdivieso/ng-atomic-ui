import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplate, PaginatedList } from '@interfaces/aaa';
import { environment } from '@env/environment';

describe('NotificationTemplateService', () => {
  let service: NotificationTemplateService;
  let http: HttpTestingController;
  const baseUrl = `${environment.authUrl}/v1/NotificationTemplates`;
  const tpl: NotificationTemplate = {
    id: 't-1',
    instanceId: 'i-1',
    asset: 'VINCULATION',
    type: 'EMAIL',
    name: 'Test',
    language: 'en',
    template: '<p>hi</p>'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NotificationTemplateService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll returns the PaginatedList shape', done => {
    const paged: PaginatedList<NotificationTemplate> = {
      items: [tpl],
      totalItems: 15,
      pageIndex: 0,
      totalPages: 2
    };
    service.getAll({ pageNumber: 1, pageSize: 10 }).subscribe(page => {
      expect(page.items).toEqual([tpl]);
      done();
    });
    http.expectOne(r => r.url === baseUrl).flush(paged);
  });

  it('CRUD round-trip', done => {
    service.create({
      asset: 'A', type: 'EMAIL', name: 'X', language: 'en', template: '<p/>'
    }).subscribe(() => {
      service.update('t-1', { name: 'Y' }).subscribe(() => {
        service.delete('t-1').subscribe(() => done());
        http.expectOne(`${baseUrl}/t-1`).flush(null);
      });
      http.expectOne(`${baseUrl}/t-1`).flush(null);
    });
    http.expectOne(baseUrl).flush(tpl);
  });
});
