import {Injectable, ErrorHandler} from '@angular/core';
import {AlertController} from 'ionic-angular';

declare var window: any;

/*
 * Zentralisiert das Feedback an den Benutzer über bestimmte Ausgabemöglichkeiten
 */
@Injectable()
export class MessageHandlerService {

  constructor(private alertCtrl: AlertController, private errorHandler: ErrorHandler) {
  }

  /*
   * Zeigt eine Nachricht in einem Alert an
   *
   * @param message: Die anzuzeigende Nachricht
   * @param error:  Wird ein Fehler übergeben, wird dieser vom Errorhandler verarbeitet
   */
  public showAlert(message: string, error: Error) {
    if(error) {
      this.errorHandler.handleError(error);
    }
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  /*
   * Zeigt eine kurze Fehlernotiz als roten Toast an
   * @param message: Die anzuzeigende Nachricht
   */
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

  /*
   * Zeigt eine kurzes Erfolgsfeedback als grünen Toast an
   * @param message: Die anzuzeigende Nachricht
   */
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
