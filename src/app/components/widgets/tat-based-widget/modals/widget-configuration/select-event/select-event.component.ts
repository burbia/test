import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LabService } from 'src/app/services/lab/lab.service';
import { Instrument } from 'src/app/models/instrument.model';
import { EventCodes, InstrumentTypes, WidgetTypes } from 'src/app/components/shared/app-constants';

@Component({
  selector: 'app-select-event',
  templateUrl: './select-event.component.html',
  styleUrls: ['./select-event.component.scss']
})
export class SelectEventComponent implements OnInit {

  allEventsList;
  availableEvents;

  preAnalytics = [];
  analytics = [];
  postAnalytics = [];
  unknownInstruments = [];

  shownPreAnalytics = [];
  shownAnalytics = [];
  shownPostAnalytics = [];
  shownUnknownInstruments = [];

  preAnalyticsSelected = [];
  analyticsSelected = [];
  postAnalyticsSelected = [];
  unknownInstrumentsSelected = [];
  eventSelected;

  @Input() widgetType: string;
  @Input() title: string;
  @Input() instruments;
  @Input() eventRecover;
  @Input() instrumentsRecover;
  @Input() moment: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelectValue = new EventEmitter<any>();


  constructor(private labService: LabService) { }

  ngOnInit() {

    this.onSelectValue.emit('BLOCK');

    this.labService.getEvents().subscribe((data: any) => {
      this.allEventsList = data.events;
      switch (this.widgetType) {
        case WidgetTypes.Test: {
          if (this.moment === 'initial') {
            this.availableEvents = this.allEventsList.filter(event =>
              (event.code === EventCodes.OrderRegistered)
            );
            this.selectEvent(this.availableEvents[0]);
          } else {
            this.availableEvents = this.allEventsList.filter(event =>
              (event.code === EventCodes.TestResults || event.code === EventCodes.TestResultProduced ||
                event.code === EventCodes.TestResultCalculated || event.code === EventCodes.TestResultReceived ||
                event.code === EventCodes.TestResultUpdated || event.code === EventCodes.TestResultValidatedTechnically ||
                event.code === EventCodes.TestResultValidatedMedically)
            );
          }
          break;
        }
        case WidgetTypes.Instrument: {
          this.availableEvents = this.allEventsList.filter(event =>
            event.code === EventCodes.SampleSeen || event.code === EventCodes.SampleSeenPreAnalytic ||
            event.code === EventCodes.SampleSeenAnalytic || event.code === EventCodes.SampleSeenPostAnalytic
            || event.code === EventCodes.SampleSortedInstrument || event.code === EventCodes.SampleNotSeen || event.code === EventCodes.SampleSeenOnUnknown
          );
          break;
        }

        case WidgetTypes.Validation: {
          if (this.moment === 'initial') {
            this.availableEvents = this.allEventsList.filter(event =>
              (event.code === EventCodes.TestResultProduced)
            );
            this.selectEvent(this.availableEvents[0]);
          } else {
            this.availableEvents = this.allEventsList.filter(event =>
              (event.code === EventCodes.TestResultValidatedTechnically || event.code === EventCodes.TestResultValidatedMedically)
            );
          }

          break;
        }
        default: {
          this.availableEvents = this.allEventsList;
        }
      }
      this.getInstruments();
    });
  }

  getInstruments() {
    this.labService.getInstruments().subscribe((data: Instrument[]) => {
      data.forEach(instrument => {
        if (this.instruments.instrumentsId.includes(instrument.id.instrumentId)) {
          if (instrument.instrumentType === InstrumentTypes.Analytic) {
            this.analytics.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PostAnalytic) {
            this.postAnalytics.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PreAnalytic) {
            this.preAnalytics.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.Unknown) {
            this.unknownInstruments.push(instrument);
          }
        }
      });
      if (this.eventRecover && this.sameInstrumentsSelected()) {
        this.recoverSelection(data);
      }
    });
  }

  sameInstrumentsSelected() {
    let match = true;
    if (this.instrumentsRecover === "") {
      return true;
    }
    this.instrumentsRecover.split(',').forEach(instrumentId => {
      if (!this.instruments.instrumentsId.includes(instrumentId)) {
        match = false;
        this.onSelectValue.emit('BLOCK');
      }
    });
    return match;
  }

  recoverSelection(allInstrumentsInLab) {
    const eventRecover = this.eventRecover;
    const eventSelected = this.availableEvents.filter(event => event.code === eventRecover[0])[0];

    // Check if the event exists in the available events, if not, it means we are changing the type
    if (eventSelected === undefined) {
      // This means we are in validation and initial moment so we only have on event available
      if (this.widgetType === WidgetTypes.Validation && this.moment === 'initial') {
        this.selectEvent(this.eventSelected);
      }
      return;
    } else {
      this.eventSelected = eventSelected;
      this.selectEvent(this.eventSelected);
    }

    // Special case for sample not seen
    if (eventRecover[0] === EventCodes.SampleNotSeen) {
      allInstrumentsInLab.forEach((instrument: Instrument) => {
        if (!this.instrumentsRecover.split(',').includes(instrument.id.instrumentId)) {
          if (instrument.instrumentType === InstrumentTypes.Analytic) {
            this.analyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PostAnalytic) {
            this.postAnalyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PreAnalytic) {
            this.preAnalyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.Unknown) {
            this.unknownInstrumentsSelected.push(instrument);
          }
        }
      });

    } else {
      allInstrumentsInLab.forEach((instrument: Instrument) => {
        if (this.instrumentsRecover.split(',').includes(instrument.id.instrumentId)) {
          if (instrument.instrumentType === InstrumentTypes.Analytic) {
            this.analyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PostAnalytic) {
            this.postAnalyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.PreAnalytic) {
            this.preAnalyticsSelected.push(instrument);
          } else if (instrument.instrumentType === InstrumentTypes.Unknown) {
            this.unknownInstrumentsSelected.push(instrument);
          }
        }
      });
    }

    if (this.eventSelected.instruments !== InstrumentTypes.Manual) {
      this.processEvent();
    }
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

  allUnkownInstrumentsSelected() {
    if (this.unknownInstrumentsSelected.length === this.unknownInstruments.length) {
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

  allLabSelected() {
    if (this.instruments.instrumentsId.length === (this.preAnalyticsSelected.length +
      this.analyticsSelected.length + this.postAnalyticsSelected.length + this.unknownInstrumentsSelected.length)) {
      return true;
    }
    return false;
  }

  toggleAllLab(click) {
    if (click.checked) {
      this.preAnalyticsSelected = this.preAnalytics;
      this.postAnalyticsSelected = this.postAnalytics;
      this.analyticsSelected = this.analytics;
      this.unknownInstrumentsSelected = this.unknownInstruments;
    } else {
      this.preAnalyticsSelected = [];
      this.postAnalyticsSelected = [];
      this.analyticsSelected = [];
      this.unknownInstrumentsSelected = [];
    }
    this.processEvent();
  }

  selectZone(click, zone) {
    switch (zone) {
      case InstrumentTypes.PreAnalytic: {
        if (click.checked) {
          this.preAnalyticsSelected = this.preAnalytics;
        } else {
          this.preAnalyticsSelected = [];
        }
        break;
      }
      case InstrumentTypes.Analytic: {
        if (click.checked) {
          this.analyticsSelected = this.analytics;
        } else {
          this.analyticsSelected = [];
        }
        break;
      }
      case InstrumentTypes.PostAnalytic: {
        if (click.checked) {
          this.postAnalyticsSelected = this.postAnalytics;
        } else {
          this.postAnalyticsSelected = [];
        }
        break;
      }
      case InstrumentTypes.Unknown: {
        if (click.checked) {
          this.unknownInstrumentsSelected = this.unknownInstruments;
        } else {
          this.unknownInstrumentsSelected = [];
        }
        break;
      }
    }
    this.processEvent();
  }

  // When the user picks an event
  selectEvent(event) {
    this.eventSelected = event;
    this.shownPreAnalytics = [];
    this.shownAnalytics = [];
    this.shownPostAnalytics = [];
    this.shownUnknownInstruments = [];
    this.preAnalyticsSelected = [];
    this.analyticsSelected = [];
    this.postAnalyticsSelected = [];
    this.unknownInstrumentsSelected = [];
    switch (event.instruments) {
      case (InstrumentTypes.All): {
        this.shownAnalytics = this.analytics;
        this.shownPostAnalytics = this.postAnalytics;
        this.shownPreAnalytics = this.preAnalytics;
        this.shownUnknownInstruments = this.unknownInstruments;
        if (event.code === EventCodes.SampleNotSeen) {
          this.processEvent();
        } else {
          this.sendEvent(null);
        }
        break;
      }
      case (InstrumentTypes.Analytic): {
        this.shownAnalytics = this.analytics;
        this.sendEvent(null);
        break;
      }
      case (InstrumentTypes.PreAnalytic): {
        this.shownPreAnalytics = this.preAnalytics;
        this.sendEvent(null);
        break;
      }
      case (InstrumentTypes.PostAnalytic): {
        this.shownPostAnalytics = this.postAnalytics;
        this.sendEvent(null);
        break;
      }
      case (InstrumentTypes.Unknown): {
        this.shownUnknownInstruments = this.unknownInstruments;
        this.sendEvent(null);
        break;
      }
      case (InstrumentTypes.Manual): {
        let result;
        result = {
          eventType: [event.code],
          instrumentsId: []
        };
        this.sendEvent(result);
      }
    }
  }

  sendEvent(event) {
    if (event) {
      const eventToSend = {
        eventType: event.eventType,
        instrumentsId: event.instrumentsId.toString()
      };
      this.onSelectValue.emit(eventToSend);
      console.log(eventToSend);
    } else {
      this.onSelectValue.emit(null);
    }
  }

  // When the user selects an instrument
  processEvent() {
    let result;
    let eventCodes = [this.eventSelected.code];
    const preAnalyticsSelectedId = this.preAnalyticsSelected.map((instrument: Instrument) => instrument.id.instrumentId);
    const analyticsSelectedId = this.analyticsSelected.map((instrument: Instrument) => instrument.id.instrumentId);
    const postAnalyticsSelectedId = this.postAnalyticsSelected.map((instrument: Instrument) => instrument.id.instrumentId);
    const unknownInstrumentsSelectedId = this.unknownInstrumentsSelected.map((instrument: Instrument) => instrument.id.instrumentId);
    let instrumentsSelected = preAnalyticsSelectedId.concat(analyticsSelectedId).concat(postAnalyticsSelectedId).concat(unknownInstrumentsSelectedId);
    switch (this.eventSelected.code) {
      case EventCodes.SampleSeen: {
        eventCodes = [EventCodes.SampleSeen, EventCodes.SampleSeenManually, EventCodes.SampleSeenPreAnalytic,
        EventCodes.SampleSeenAnalytic, EventCodes.SampleSeenPostAnalytic, EventCodes.SampleSeenOnUnknown];
        if (instrumentsSelected.length === 0) {
          this.sendEvent(null);
          return;
        }
        result = {
          eventType: eventCodes,
          instrumentsId: instrumentsSelected
        };
        this.sendEvent(result);
        break;
      }
      case EventCodes.SampleNotSeen: {
        eventCodes = [EventCodes.SampleNotSeen, EventCodes.SampleSeenManually, EventCodes.SampleSeenPreAnalytic,
        EventCodes.SampleSeenAnalytic, EventCodes.SampleSeenPostAnalytic, EventCodes.SampleSeenOnUnknown];
        instrumentsSelected = this.notSelectedInstruments();
        if (instrumentsSelected.length === 0) {
          this.sendEvent(null);
          return;
        }
        result = {
          eventType: eventCodes,
          instrumentsId: instrumentsSelected
        };
        this.sendEvent(result);
        break;
      }
      case EventCodes.TestResults: {
        result = {
          eventType: [EventCodes.TestResults, EventCodes.TestResultProduced, EventCodes.TestResultReceived,
          EventCodes.TestResultUpdated, EventCodes.TestResultCalculated],
          instrumentsId: analyticsSelectedId
        };
        this.sendEvent(result);
        break;
      }
      default: {
        if (instrumentsSelected.length === 0) {
          this.sendEvent(null);
          return;
        }
        result = {
          eventType: eventCodes,
          instrumentsId: instrumentsSelected
        };
        this.sendEvent(result);
      }
    }
  }

  notSelectedInstruments() {
    const preAnalytics = this.preAnalytics.filter(x => !this.preAnalyticsSelected.includes(x)).map((instrument: Instrument) => instrument.id.instrumentId);
    const postAnalytics = this.postAnalytics.filter(x => !this.postAnalyticsSelected.includes(x)).map((instrument: Instrument) => instrument.id.instrumentId);
    const analytics = this.analytics.filter(x => !this.analyticsSelected.includes(x)).map((instrument: Instrument) => instrument.id.instrumentId);
    const unknown = this.unknownInstruments.filter(x => !this.unknownInstrumentsSelected.includes(x)).map((instrument: Instrument) => instrument.id.instrumentId);
    return (preAnalytics.concat(postAnalytics).concat(analytics).concat(unknown));
  }
}
