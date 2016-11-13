import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AudioProvider } from 'ionic-audio/dist/ionic-audio';


import { RecordAudio } from '../pages/recordAudio/recordAudio.component';
import { PlayAudio } from '../pages/playAudio/playAudio.component';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RecordAudio;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Nachricht aufnehmen', component: RecordAudio },
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
ionicBootstrap(MyApp, [provide(AudioProvider,  { useFactory: AudioProvider.factory })], {

});  
  