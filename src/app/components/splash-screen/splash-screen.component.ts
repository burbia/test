import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  constructor(private router: Router, private dashboardService: DashboardService) {


  }

  ngOnInit() {

    setTimeout(() => {
      this.router.navigate(['/']);
    });

    // this.dashboardService.recover().subscribe(data => {
    //   if (data) {
    //     this.router.navigate(['/dashboard']);
    //   } else {
    //     this.router.navigate(['/layout']);
    //   }
    // });
  }

}
