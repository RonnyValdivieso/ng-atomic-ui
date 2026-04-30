import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ModuleService } from './module.service';
import { Module } from '@interfaces/aaa';
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

  it('getAll hits /v1/modules and returns the flat array', done => {
    service.getAll().subscribe(list => {
      expect(list).toEqual([mod]);
      done();
    });
    http.expectOne(baseUrl).flush([mod]);
  });

  it('getById hits /v1/modules/{id}', done => {
    service.getById('m-1').subscribe(result => {
      expect(result.name).toBe('AIAgents');
      done();
    });
    http.expectOne(`${baseUrl}/m-1`).flush(mod);
  });

  it('getPermissions hits /v1/modules/{id}/permissions', done => {
    service.getPermissions('m-1').subscribe(perms => {
      expect(perms.length).toBe(1);
      done();
    });
    http.expectOne(`${baseUrl}/m-1/permissions`).flush([{ id: 'p-1', name: 'Read' }]);
  });

  it('create posts the body to /v1/modules', done => {
    service.create({ name: 'Foo' }).subscribe(result => {
      expect(result.name).toBe('Foo');
      done();
    });
    const req = http.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Foo' });
    req.flush({ id: 'm-2', name: 'Foo', status: 'ACTIVE' });
  });

  it('update PUTs to /v1/modules/{id}', done => {
    service.update('m-1', { name: 'Bar' }).subscribe(() => done());
    const req = http.expectOne(`${baseUrl}/m-1`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('delete DELETEs /v1/modules/{id}', done => {
    service.delete('m-1').subscribe(() => done());
    const req = http.expectOne(`${baseUrl}/m-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
