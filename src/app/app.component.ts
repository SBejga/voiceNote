import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen} from 'ionic-native';

import { RecordAudioPage } from '../pages/recordAudio/recordAudio';
import { PlayAudio } from '../pages/playAudio/playAudio';

import { Database } from '../providers/database';

@Component({
  templateUrl: 'app.html',
  providers: [Database]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RecordAudioPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Nachricht aufnehmen', component: RecordAudioPage },
      { title: 'Aufnahmen abspielen', component: PlayAudio }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
