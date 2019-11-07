import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  private cacheMap: Map<ApiKey, any> = new Map();

  getData<T = any[]>(key: ApiKey) {
    if (this.cacheMap.has(key)) {
      return of<T>(this.cacheMap.get(key));
    }

    if (localStorage.getItem(key)) {
      return of<T>(JSON.parse(localStorage.getItem(key)));
    }

    return of<T>([] as any);
  }

  saveData<T>(key: ApiKey, data: any) {
    return of(null)
      .pipe(
        tap(() => {
          this.cacheMap.set(key, data);
          localStorage.setItem(key, JSON.stringify(data));
        }),
        map(() => data as T)
      );
  }
}

export enum ApiKey {
  USER = '__LS_USER',
}