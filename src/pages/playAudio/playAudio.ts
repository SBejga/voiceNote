import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-play-audio',
  templateUrl: 'playAudio.html',
})
export class PlayAudio {

  voiceMessages: Array<{title: string, currentlyPlaying: boolean}>;
  public currentlyPlayingIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.voiceMessages = [];
    this.currentlyPlayingIndex = -1;

    for (let i = 0; i <= 10; i++) {
      this.voiceMessages.push({
        title: "voiceMessage " + i,
        currentlyPlaying: false
      })
    }
  }

  startPlaying(i) {
    if (this.currentlyPlayingIndex >= 0) {
      this.stopPlaying();
    }
    this.currentlyPlayingIndex = i;
    this.voiceMessages[i].currentlyPlaying = true;

  }

  stopPlaying() {
    this.voiceMessages[this.currentlyPlayingIndex].currentlyPlaying = false;
    this.currentlyPlayingIndex = -1;

  }

}
