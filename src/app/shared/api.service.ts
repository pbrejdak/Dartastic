import { Injectable } from '@angular/core';
import { of } from 'rxjs';

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

    return of<T>([]);
  }

  saveData(key: ApiKey, data: any) {
    this.cacheMap.set(key, data);
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export enum ApiKey {
  USER = '__LS_USER',
}