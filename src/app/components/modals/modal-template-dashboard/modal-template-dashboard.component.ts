import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-template-dashboard',
  templateUrl: './modal-template-dashboard.component.html',
  styleUrls: ['./modal-template-dashboard.component.scss']
})
export class ModalTemplateDashboardComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalTemplateDashboardComponent>, private router: Router) { }

  ngOnInit() {
  }
  newDash() {
    this.router.navigate(['/dashboard']);
    this.dialogRef.close();
  }
  templateDash() {
    this.router.navigate(['/dashboard']);
    this.dialogRef.close();
  }

}
