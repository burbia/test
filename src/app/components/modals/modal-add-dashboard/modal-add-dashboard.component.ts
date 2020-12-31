import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-add-dashboard',
  templateUrl: './modal-add-dashboard.component.html',
  styleUrls: ['./modal-add-dashboard.component.scss']
})
export class ModalAddDashboardComponent implements OnInit {


  dashboardTitleForm = new FormGroup({
    dashboardTitle: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(public dialogRef: MatDialogRef<ModalAddDashboardComponent>) { }

  ngOnInit() {
  }
  proceed() {
    this.dialogRef.close(this.dashboardTitleForm.controls['dashboardTitle'].value);
  }
  cancel() {
    this.dialogRef.close();
  }
  get titleForm() { return this.dashboardTitleForm.controls; }

}
