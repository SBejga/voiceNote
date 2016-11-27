import {Component} from '@angular/core';
import {Database} from '../../providers/database'
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-play-audio',
  templateUrl: 'playAudio.html',
  providers: [Database]
})
export class PlayAudio {

  voiceMessages: Array<{
    message:any
  }>;
  public offset:number;
  public currentlyPlayingIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database:Database) {
    this.offset=0;
    this.database.getRecordings(20,this.offset).then(
        (recordings) => {
          this.voiceMessages = recordings;
        },
        (error) => {
          //TODO: errorhandling
        }
    )
    this.currentlyPlayingIndex = -1;

  }

  startPlaying(i) {
    if (this.currentlyPlayingIndex >= 0) {
      this.stopPlaying();
    }
    this.currentlyPlayingIndex = i;
  }

  stopPlaying() {
    this.currentlyPlayingIndex = -1;
  }

}
