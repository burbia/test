import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}

  canActivate() {
    return true; /*
            const tokenExpired = this.authService.isExpired();
            if (!tokenExpired) {
                // logged in so return true
                return true;
            }
            // not logged in so redirect to login page with the return url
            window.location.href = '/oauth';
            return false;
            */
  }
}
