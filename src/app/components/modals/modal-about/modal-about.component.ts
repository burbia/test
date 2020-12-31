import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { aboutVerison, build, udi } from '../../../../../package.json';

@Component({
  selector: 'app-modal-about',
  templateUrl: './modal-about.component.html',
  styleUrls: ['./modal-about.component.scss']
})
export class ModalAboutComponent {
  public version: string;
  public build: string;
  public udi: string;
  constructor(public dialogRef: MatDialogRef<ModalAboutComponent>) {
    this.version = aboutVerison;
    this.build = build;
    this.udi = udi;
  }
}
