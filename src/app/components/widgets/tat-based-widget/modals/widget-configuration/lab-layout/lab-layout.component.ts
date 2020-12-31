import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Instrument } from 'src/app/models/instrument.model';
import { InstrumentTypes } from 'src/app/components/shared/app-constants';
import { LabService } from 'src/app/services/lab/lab.service';

@Component({
  selector: 'app-lab-layout',
  templateUrl: './lab-layout.component.html',
  styleUrls: ['./lab-layout.component.scss']
})
export class LabLayoutComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelectInstrument = new EventEmitter<any>();
  @Input() selectedInstruments;

  preAnalytics = [];
  analytics = [];
  postAnalytics = [];

  preAnalyticsSelected = [];
  analyticsSelected = [];
  postAnalyticsSelected = [];

  constructor(private labService: LabService) { }

  ngOnInit() {
    this.labService.getInstruments().subscribe((data: Instrument[]) => {
      data.forEach(element => {
        if (element.instrumentType === InstrumentTypes.Analytic || element.instrumentType === InstrumentTypes.Unknown) {
          this.analytics.push(element);
        } else if (element.instrumentType === InstrumentTypes.PostAnalytic) {
          this.postAnalytics.push(element);
        } else if (element.instrumentType === InstrumentTypes.PreAnalytic) {
          this.preAnalytics.push(element);
        }
      });
      if (this.selectedInstruments.instrumentsId) {
        this.recoverSelection(data);
      }
      this.sendInstrument();
    });
  }

  recoverSelection(instruments) {
    const aSelected = [];
    const preSelected = [];
    const postSelected = [];
    instruments.forEach((instrument: Instrument) => {
      const instrumentSelected = this.selectedInstruments.instrumentsId.findIndex((instrumentId: string) =>
        instrumentId === instrument.id.instrumentId);
      if (instrumentSelected !== -1) {
        if (instrument.instrumentType === InstrumentTypes.Analytic || instrument.instrumentType === InstrumentTypes.Unknown) {
          aSelected.push(instrument);
        } else if (instrument.instrumentType === InstrumentTypes.PostAnalytic) {
          postSelected.push(instrument);
        } else if (instrument.instrumentType === InstrumentTypes.PreAnalytic) {
          preSelected.push(instrument);
        }
      }
    });
    this.preAnalyticsSelected = preSelected;
    this.postAnalyticsSelected = postSelected;
    this.analyticsSelected = aSelected;
  }

  sendInstrument() {
    const postAnalyticsSelected = this.postAnalyticsSelected.map((instrument: Instrument) =>
      instrument.id.instrumentId);
    const preAnalyticsSelected = this.preAnalyticsSelected.map((instrument: Instrument) =>
      instrument.id.instrumentId);
    const analyticsSelected = this.analyticsSelected.map((instrument: Instrument) =>
      instrument.id.instrumentId);
    this.onSelectInstrument.emit({
      instrumentsId: analyticsSelected.concat(preAnalyticsSelected).concat(postAnalyticsSelected)
    });
  }

  allPreSelected() {
    if (this.preAnalyticsSelected.length === this.preAnalytics.length) {
      return true;
    }
    return false;
  }

  allPostSelected() {
    if (this.postAnalyticsSelected.length === this.postAnalytics.length) {
      return true;
    }
    return false;
  }

  allAnalyticsSelected() {
    if (this.analyticsSelected.length === this.analytics.length) {
      return true;
    }
    return false;
  }

  toggleFullSelection(click, zone: string) {

    switch (zone) {
      case (InstrumentTypes.PreAnalytic): {
        if (click.checked) {
          this.preAnalyticsSelected = this.preAnalytics;
        } else {
          this.preAnalyticsSelected = [];
        }
        break;
      }
      case (InstrumentTypes.Analytic): {
        if (click.checked) {
          this.analyticsSelected = this.analytics;
        } else {
          this.analyticsSelected = [];
        }
        break;
      }
      case (InstrumentTypes.PostAnalytic): {
        if (click.checked) {
          this.postAnalyticsSelected = this.postAnalytics;
        } else {
          this.postAnalyticsSelected = [];
        }
        break;
      }
    }
    this.sendInstrument();
  }
}
