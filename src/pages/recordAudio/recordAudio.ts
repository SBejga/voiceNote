import {Component} from '@angular/core';

import {AlertController, ModalController} from 'ionic-angular';
import {MediaPlugin} from 'ionic-native';

@Component({
  selector: 'page-record-audio',
  templateUrl: 'recordAudio.html'
})
export class RecordAudio {

  public isRecording: boolean = false;
  // const fs: string = cordova.file.dataDirectory;

  media: MediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');

  constructor(public alertCtrl: AlertController, public modalCtrl: ModalController) {

  }

  public startRecording() {
    try {
      //    this.media.startRecord();
      this.isRecording = true;
    } catch (e) {
      console.log(e);
      this.showAlert('Die Aufnahme konnte nicht gestartet werden2.');
    }
  }

  public stopRecording() {
    try {
      //    this.media.stopRecord();
      this.isRecording = false;

      let title: string = '';

      let dialog = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: 'Audio speichern',
        inputs: [{
          name: 'title',
          placeholder: 'Titel'
        }],
        buttons: [{
          text: 'Audio verwerfen',
          handler: data => {
            dialog.dismiss(false);
            return false;
          }
        }, {
          text: 'Audio Speichern',
          handler: data => {
            title = data.title;
            dialog.dismiss(true);
            return false;
          }
        }]
      });

      dialog.onDidDismiss(data => {
        if(data === false) return;
      });

      dialog.present();

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
