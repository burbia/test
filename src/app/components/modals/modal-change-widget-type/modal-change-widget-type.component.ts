import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-change-widget-type',
  templateUrl: './modal-change-widget-type.component.html',
  styleUrls: ['./modal-change-widget-type.component.scss']
})
export class ModalChangeWidgetTypeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalChangeWidgetTypeComponent>) { }

  ngOnInit() {
  }
  proceed() {
    this.dialogRef.close('ok');
  }
  cancel() {
    this.dialogRef.close();
  }

}
