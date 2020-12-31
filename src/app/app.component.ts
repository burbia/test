import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from './app-routing.animations';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  public optionsLottie: Object;
  constructor(translate: TranslateService, private userService: UserService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    this.optionsLottie = {
      path: 'assets/lottie/resize.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    };
  }

  title = 'app';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F11') {
      event.preventDefault();
    }
    if (event.key === 'F1') {
      this.userService.openUA('DASH');
    }
  }
  ngOnInit(): void {}

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
