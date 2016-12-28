import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {RecordAudioPage} from '../pages/recordAudio/recordAudio';
import {PlayAudio} from '../pages/playAudio/playAudio';
import {LoginPage} from '../pages/login/login';

import {AuthorizerService} from "../providers/authorizer";
import {DatabaseService} from "../providers/database";
import {MessageHandlerService} from "../providers/messageHandler";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(private platform: Platform, private authorizer: AuthorizerService,
              private database: DatabaseService, private messageHandler: MessageHandlerService) {
    this.initializeApp();

    this.pages = [
      {title: 'Nachricht aufnehmen', component: RecordAudioPage},
      {title: 'Aufnahmen abspielen', component: PlayAudio}
    ];

  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.database.init() // Initialisiere die Datenbank
        .then(
          () => {
            return this.database.getLoggedInUser(); // Prüfe, ob jemand eingeloggt ist
          }
        )
        .then(
          (user) => {
            if (user) { // Falls jemand eingeloggt ist, starte mit der Aufnahmeseite
              this.authorizer.setUser(user);
              this.rootPage = RecordAudioPage;
            } else { // Ansonsten mit dem Login
              this.rootPage  = LoginPage;
            }
            StatusBar.styleDefault();
            Splashscreen.hide();
          }
        )
        .catch(
          (error) => {
            this.messageHandler.showAlert('Es gab einen Fehler bei der Initialisierung der Datenbank.', error);
          }
        );
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public logout() {
    this.authorizer.setUser(null);
    this.database.setUserLoggedIn(-1);
    this.nav.setRoot(LoginPage);
  }
}
