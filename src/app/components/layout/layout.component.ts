import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalTemplateDashboardComponent } from '../modals/modal-template-dashboard/modal-template-dashboard.component';
import { Instrument } from 'src/app/models/instrument.model';
import { LabService } from 'src/app/services/lab/lab.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() public isWidget: boolean;
  public preanalytics: Instrument[];
  public analytics: Instrument[];
  public postanalytics: Instrument[];
  public lastUpdate: Date;
  readonly modalWidth: string = '560px';
  readonly instrument: string = 'INSTRUMENT';
  readonly postAnalytic: string = 'POST-ANALYTIC';
  readonly preAnalytic: string = 'PRE-ANALYTIC';

  constructor(private labService?: LabService, public dialog?: MatDialog) { }

  ngOnInit() {
    this.lastUpdate = new Date();
    this.preanalytics = [];
    this.analytics = [];
    this.postanalytics = [];
    this.labService.getInstruments().subscribe((data: Instrument[]) => {
      data.forEach(element => {
        if (element.instrumentType === this.instrument) {
          this.analytics.push(element);
        } else if (element.instrumentType === this.postAnalytic) {
          this.postanalytics.push(element);
        } else if (element.instrumentType === this.preAnalytic) {
          this.preanalytics.push(element);
        }
      });
    });

  }

  confirmLayout() {
    const dialogRef = this.dialog.open(ModalTemplateDashboardComponent, {
      width: this.modalWidth,
      autoFocus: false,
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }
}
