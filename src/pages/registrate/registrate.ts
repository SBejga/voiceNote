import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {RecordAudioPage} from '../recordAudio/recordAudio';
import {DatabaseService} from '../../providers/database';
import {MessageHandlerService} from "../../providers/messageHandler";

@Component({
  selector: 'page-registrate',
  templateUrl: 'registrate.html'
})
export class RegistratePage {

  public username: string = '';
  public password: string = '';
  public password2: string = '';

  constructor(private nav: NavController, private menu: MenuController,
              private database: DatabaseService, private messageHandler: MessageHandlerService) {
  }

  //noinspection JSUnusedGlobalSymbols
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  //noinspection JSUnusedGlobalSymbols
  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  public registrate() {
    if (this.password !== this.password2) {
      this.messageHandler.showErrorToast('Die Passwörter stimmen nicht überein.');
      return;
    }
    this.database.createUser(this.username, this.password).then(
      (userId) => {
        if (userId === -1) {
          this.messageHandler.showErrorToast('Der Nutzername existiert bereits.');
          return;
        }

        this.nav.setRoot(RecordAudioPage);
      //  this.openTutorial();

      }
    );
  }
/*
  private openTutorial() {
    let modal = this.modalController.create(TutorialModal, {
      imageTexts: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T5'
      ]
    });

    modal.onDidDismiss(
      () => {
        this.nav.setRoot(RecordAudioPage);
      }
    );
    modal.present();
  }
  */
}
