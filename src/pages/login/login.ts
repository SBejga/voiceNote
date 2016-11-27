import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

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

}
