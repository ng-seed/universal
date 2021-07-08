import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { flow } from 'lodash/fp';
import { retry } from 'rxjs/operators';

import { HTTP_CLIENT__MAX_RETRIES } from './constants';
import { BaseDocument, UniqueId } from './models/base-document';

@Injectable()
export abstract class BaseService<T extends BaseDocument> {
  protected constructor(
    protected readonly config: ConfigService,
    protected readonly http: HttpClient,
    protected readonly settingsKey: string | Array<string>
  ) {}

  getMany$() {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.get<Array<T>>(backend.endpoint).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  getOne$(id: UniqueId) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.get<T>(`${backend.endpoint}/${id}`).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  createMany$(resources: Array<T>) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.post<Array<T>>(backend.endpoint, resources).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  createOne$(resource: T) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.post<T>(backend.endpoint, resource).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  updateMany$(resources: Array<T>) {
    const backend = this.config.getSettings(this.settingsKey);

    return flow(
      (cur: Array<T>) => cur.map(resource => resource.id).join(','),
      cur => this.http.patch<Array<T>>(`${backend.endpoint}/${cur}`, resources).pipe(retry(HTTP_CLIENT__MAX_RETRIES))
    )(resources);
  }

  updateOne$(resource: T) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.patch<T>(`${backend.endpoint}/${resource.id}`, resource).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  deleteMany$(ids: Array<UniqueId>) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http
      .delete<Array<UniqueId>>(`${backend.endpoint}/${ids.join(',')}`)
      .pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }

  deleteOne$(id: UniqueId) {
    const backend = this.config.getSettings(this.settingsKey);

    return this.http.delete<UniqueId>(`${backend.endpoint}/${id}`).pipe(retry(HTTP_CLIENT__MAX_RETRIES));
  }
}
