import { NgModule, ErrorHandler } from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

import { RecordAudioPage } from '../pages/recordAudio/recordAudio';
import { PlayAudio } from '../pages/playAudio/playAudio';
import { LoginPage } from '../pages/login/login';
import {RegistratePage} from "../pages/registrate/registrate";
import {SecondsToTimePipe} from "../pipes/secondsToTime";
import {DatabaseService} from "../providers/database";
import {AuthorizerService} from "../providers/authorizer";
import {MessageHandlerService} from "../providers/messageHandlerService";

@NgModule({
  declarations: [
    MyApp,
    RecordAudioPage,
    PlayAudio,
    LoginPage,
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
    RegistratePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseService,
    MessageHandlerService,
    AuthorizerService
  ]
})
export class AppModule {}
