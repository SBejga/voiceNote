import {Component} from '@angular/core';

import {AlertController} from 'ionic-angular';
import {MediaPlugin} from 'ionic-native';

@Component({
  selector: 'page-record-audio',
  templateUrl: 'recordAudio.html'
})
export class RecordAudio {

  public isRecording: boolean = false;

  media: MediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');

  constructor(public alertCtrl: AlertController) {

  }

  public startRecording() {
    try {
 //     this.media.startRecord();
      this.isRecording = true;
    } catch (e) {
      this.showAlert('Die Aufnahme konnte nicht gestartet werden.');
    }
  }

  public stopRecording() {
    try {
   //   this.media.stopRecord();
      this.isRecording = false;
    } catch (e) {
      this.showAlert('Die Aufnahme konnte nicht gestoppt werden.');
    }
  }

  public showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
