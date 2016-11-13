import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { RecordAudio } from '../pages/recordAudio/recordAudio.component';
import { PlayAudio } from '../pages/playAudio/playAudio.component';

@NgModule({
  declarations: [
    MyApp,
    RecordAudio,
    PlayAudio
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecordAudio,
    PlayAudio
  ],
  providers: []
})
export class AppModule {}
