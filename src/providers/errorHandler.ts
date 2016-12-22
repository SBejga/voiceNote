import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class ErrorHandlerService {

  constructor(private alertCtrl: AlertController) {
  }

  public showAlert(message: string, error: Error) {
    console.log(error);
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: message + ' \n ' + error.message, // TODO: remove e.message in production
      buttons: ['OK']
    });
    alert.present();
  }
}
