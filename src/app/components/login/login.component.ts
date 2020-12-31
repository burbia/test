import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  template: ''
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {
    console.log('Route received on login ');
    this.authService.setSession(this.route.snapshot.fragment.split('&')[0].split('=')[1]);
  }

  ngOnInit() {
    console.log('NgOnInit: Route received on login ');
  }

}
