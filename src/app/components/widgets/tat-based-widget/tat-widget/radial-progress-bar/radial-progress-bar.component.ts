import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { TatBasedConfiguration } from '../../model/tat-based-configuration.model';

@Component({
  selector: 'app-radial-progress-bar',
  templateUrl: './radial-progress-bar.component.html',
  styleUrls: ['./radial-progress-bar.component.scss']
})
export class RadialProgressBarComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() configuration: any;
  @ViewChild('alarmPie', { static: true }) alarmPie: ElementRef;
  // D3 objects
  alarmPieD3: any;

  constructor() {

  }
  ngAfterContentInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configuration) {
      const change = changes.configuration;
      const alarmPieData = this.calculateAlarmPieData(this.configuration);
      if ((change.firstChange && change.currentValue && !change.previousValue)
        || (!change.firstChange && change.currentValue && !change.previousValue)) {
        this.alarmPieD3 = this.alarmPieProgress(this.alarmPie.nativeElement, alarmPieData);
      } if (!change.firstChange && change.currentValue && change.previousValue) {
        this.alarmPieD3.updateData(alarmPieData);
      }
    }
  }

  ngOnInit() {

  }

  calculateAlarmPieData(configuration: TatBasedConfiguration) {
    if (configuration) {
      const percentageOkAlarm = ((configuration.warningTarget / configuration.issueTarget) * 100) - 1;
      const percentageWarningAlarm = 99 - percentageOkAlarm;
      return [1, percentageOkAlarm, 1, percentageWarningAlarm];
    }
  }

  alarmPieProgress(selector: any, values: Array<number>) {
    const data = values;
    const width = 100,
      height = 100,
      radius = 50;

    const arc = d3.arc()
      .innerRadius(40)
      .outerRadius(radius);

    const pie = d3.pie().sort(null);
    const adjust = 3;
    const svg = d3.select(selector).append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-30 -49 160 160')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') rotate(' + -adjust + ')');

    const color = ['white', 'transparent', 'black', 'transparent'];

    const path = svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .style('fill', function (d, i) {
        return color[i];
      })
      .attr('d', arc)
      .each(function (d) { this._current = d; });

    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }

    return {
      updateData: function (newData) {
        path.data(pie(newData));
        path.transition().duration(750).attrTween('d', arcTween); // redraw the arcs
      }
    };
  }
}
