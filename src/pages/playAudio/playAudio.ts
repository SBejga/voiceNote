import {Component} from '@angular/core';

import {Database} from '../../providers/database'
import {ErrorHandler} from '../../providers/errorHandler'

@Component({
  selector: 'page-play-audio',
  templateUrl: 'playAudio.html'
})
export class PlayAudio {

  public currentlyPlayingIndex: number = -1;
  public voiceMessages: Array<{id: number, title: string, date: Date, duration: number}> = [];

  private offset:number = 0;
  private limit: number = 20;

  constructor(private database:Database, private errorHandler: ErrorHandler) {
    this.loadMessages();
  }

  public startPlaying(i) {
    if (this.currentlyPlayingIndex >= 0) {
      this.stopPlaying();
    }
    this.currentlyPlayingIndex = i;
  }

  public stopPlaying() {
    this.currentlyPlayingIndex = -1;
  }

  private loadMessages() {
    this.database.getRecordings(this.limit, this.offset).then(
      (recordings) => {
        console.log('Recordings:', recordings);
        this.voiceMessages = this.voiceMessages.concat(recordings);
      },
      (error) => {
        this.errorHandler.showAlert('Es konnten keine vorhandenen Aufnahmen geladen werde.', error);
      }
    );
  }
}
