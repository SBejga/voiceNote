import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { RecordAudioPage } from '../pages/recordAudio/recordAudio';
import { PlayAudio } from '../pages/playAudio/playAudio';
import { LoginPage } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    RecordAudioPage,
    PlayAudio,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecordAudioPage,
    PlayAudio,
    LoginPage
  ],
  providers: []
})
export class AppModule {}
