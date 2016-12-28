import { NgModule, ErrorHandler } from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';

import { RecordAudioPage } from '../pages/recordAudio/recordAudio';
import { PlayAudio } from '../pages/playAudio/playAudio';
import { LoginPage } from '../pages/login/login';
import {RegistratePage} from '../pages/registrate/registrate';
import {TutorialModal} from "../pages/tutorialModal/tutorial";
import {SecondsToTimePipe} from '../pipes/secondsToTime';
import {DatabaseService} from '../providers/database';
import {AuthorizerService} from '../providers/authorizer';
import {MessageHandlerService} from '../providers/messageHandler';
import {ErrorHandlerService} from '../providers/errorHandler';

@NgModule({
  declarations: [
    MyApp,
    RecordAudioPage,
    PlayAudio,
    LoginPage,
    TutorialModal,
    RegistratePage,
    SecondsToTimePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecordAudioPage,
    PlayAudio,
    LoginPage,
    RegistratePage,
    TutorialModal
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorHandlerService},
    DatabaseService,
    MessageHandlerService,
    AuthorizerService
  ]
})
export class AppModule {}
