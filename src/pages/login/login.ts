import { Component } from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {RecordAudioPage} from "../recordAudio/recordAudio";
import {RegistratePage} from "../registrate/registrate";
import {DatabaseService} from "../../providers/database";
import {AuthorizerService} from "../../providers/authorizer";
import {MessageHandlerService} from "../../providers/messageHandlerService";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public username = '';
  public password = '';

  constructor(private nav: NavController, private menu: MenuController, private database: DatabaseService,
              private messageHandler: MessageHandlerService, private authorizer: AuthorizerService) {
  }

  //noinspection JSUnusedGlobalSymbols
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  //noinspection JSUnusedGlobalSymbols
  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  public login() {
    this.database.getUser(this.username, this.password).then(
      (user) => {
        if(user) {
          this.authorizer.setUser(user);
          this.nav.setRoot(RecordAudioPage);
        } else {
          this.messageHandler.showErrorToast('Benutzername und Passwort passen nicht zusammen.');
        }
      }
    )
  }

  public goToRegistrate() {
    this.nav.push(RegistratePage);
  }
}
