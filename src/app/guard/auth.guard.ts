import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    }
    // Redirect to login page if not authenticated, optionally with a return URL
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
