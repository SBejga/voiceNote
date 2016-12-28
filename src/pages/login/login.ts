import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {RecordAudioPage} from "../recordAudio/recordAudio";
import {RegistratePage} from "../registrate/registrate";
import {DatabaseService} from "../../providers/database";
import {AuthorizerService} from "../../providers/authorizer";
import {MessageHandlerService} from "../../providers/messageHandler";

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
    this.menu.swipeEnable(false); // Deaktiviert das Menü
  }

  //noinspection JSUnusedGlobalSymbols
  ionViewWillLeave() {
    this.menu.swipeEnable(true); // Aktiviert das Menü
  }

  /*
   * Prüft, ob die Daten für den Login richtig waren
   */
  public checkLogin() {
    this.database.getUser(this.username, this.password).then(
      (user) => {
        if (user) {
          this.login(user);
        } else {
          this.messageHandler.showErrorToast('Benutzername und Passwort passen nicht zusammen.');
        }
      }
    )
  }

  /*
   * Speichert den Nutzer als eingeloggt und leitet zur Aufnahmeseite weiter
   */
  private login(user) {
    this.database.setUserLoggedIn(user.id).then(
      () => {
        this.authorizer.setUser(user);
        this.nav.setRoot(RecordAudioPage);
      },
      (error) => {
        this.messageHandler.showAlert('Beim Login ist leider ein Fehler aufgetreten, bitte versuchen Sie es erneut.', error);
      }
    );
  }

  public goToRegistrate() {
    this.nav.push(RegistratePage);
  }
}
