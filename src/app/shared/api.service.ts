import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

  private cacheMap: Map<ApiKey, any> = new Map();
  private subjectMap: Map<ApiKey, ReplaySubject<any>> = new Map();

  getData<T = any[]>(key: ApiKey): ReplaySubject<T> {
    if (this.subjectMap.has(key)) {
      return this.subjectMap.get(key) as ReplaySubject<T>;
    }

    if (localStorage.getItem(key)) {
      const replaySubject = new ReplaySubject();
      replaySubject.next(JSON.parse(localStorage.getItem(key)));
      this.subjectMap.set(key, replaySubject);
      return replaySubject as ReplaySubject<T>;
    }

    const replaySubject = new ReplaySubject();
    replaySubject.next([]);
    this.subjectMap.set(key, replaySubject);
    return replaySubject as ReplaySubject<T>;
  }

  saveData<T>(key: ApiKey, data: any) {
    return of(null).pipe(
      tap(() => {
        this.cacheMap.set(key, data);

        if (this.subjectMap.has(key)) {
          this.subjectMap.get(key).next(data);
        }

        localStorage.setItem(key, JSON.stringify(data));
      }),
      map(() => data as T)
    );
  }
}

export enum ApiKey {
  USER = '__LS_USER',
  HISTORY = '__LS_HISTORY',
  LEAGUE = '__LS_LEAGUE'
}
