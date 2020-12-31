import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'secondsToMinutes'})
export class SecondsToMinutesPipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value / 60);
  }
}
