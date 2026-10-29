import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard  {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('BU-backoffice-token')) {
      return true;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['auth/login']);
    return false;
  }
}
