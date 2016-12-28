import { Pipe, PipeTransform } from '@angular/core';

/*
 * Wandelt eine Anzahl von Sekunden in das Format Stunden:Minuten:Sekunden um
 */
@Pipe({name: 'secondsToTime'})
export class SecondsToTimePipe implements PipeTransform {
  transform(seconds: number): string {
    let time: string = '';
    if(seconds >= 3600) {
      time += Math.floor(seconds/3600) + ':';
      seconds %= 3600;
    }

    if (seconds >= 600) {
      time += Math.floor(seconds / 60);
    } else if (seconds >= 60) {
      time += '0' + Math.floor(seconds / 60);
    } else {
      time += '00';
    }

    seconds %= 60;
    time += ':';

    if (seconds >= 10) {
      time += seconds;
    } else {
      time += '0' + seconds;
    }

    return time;
  }
}
