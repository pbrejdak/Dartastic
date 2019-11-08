import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import { SkirmishService } from './skirmish.service';

@Injectable({
  providedIn: 'root'
})
export class CanPlayGuard implements CanActivate, CanActivateChild {
  constructor(private skirmishService: SkirmishService, private router: Router, private route: ActivatedRoute) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canPlay(next);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canPlay(next);
  }

  canPlay(next: ActivatedRouteSnapshot) {
    if (!this.skirmishService.config) {
      this.router.navigate(['skirmish/configurator']);
    }

    return true;
  }
}
