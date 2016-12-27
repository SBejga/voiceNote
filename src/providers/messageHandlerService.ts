import {Injectable, ErrorHandler} from '@angular/core';
import {AlertController} from 'ionic-angular';

declare var window: any;

@Injectable()
export class MessageHandlerService {

  constructor(private alertCtrl: AlertController, private errorHandler: ErrorHandler) {
  }

  public showAlert(message: string, error: Error) {
    this.errorHandler.handleError(error);
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: message + ' \n ' + error.message, // TODO: remove e.message in production
      buttons: ['OK']
    });
    alert.present();
  }

  public showErrorToast(message:string) {
    window.plugins.toast.showWithOptions({
      message: message,
      duration: 'short',
      position: 'top',
      styling: {
        opacity: 0.9,
        backgroundColor: '#ff0033'
      }
    });
  }

  public showSuccessToast(message:string) {
    window.plugins.toast.showWithOptions({
      message: message,
      duration: 'short',
      position: 'center',
      styling: {
        opacity: 0.9,
        backgroundColor: '#61B329'
      }
    });
  }
}
