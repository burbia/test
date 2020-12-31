import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private router: Router) {

  }
  setSession(authResult: string) {
    if (authResult) {
      const decodedToken = helper.decodeToken(authResult);
      const isExpired = helper.isTokenExpired(authResult);
      console.log(isExpired)
      if (!isExpired) {
        localStorage.setItem('access_token', authResult);
        this.router.navigate(['/dashboardManagement']);
      }
    } else {
      alert('Unable to login');
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['dashboardManagement']).then(() => window.location.reload())
  }

  isExpired() {
    if (localStorage.getItem('access_token')) {
      return Date.now() > new Date(this.getExpiration()).getTime();
    }
    return true;
  }

  isLoggedIn() {
    if (localStorage.getItem('access_token') && !this.isExpired()) {
      return true;
    }
    return false;
  }

  getExpiration() {
    if (localStorage.getItem('access_token')) {
      const expiration = helper.getTokenExpirationDate(localStorage.getItem('access_token'));
      return expiration;
    }
    return null;
  }
}
