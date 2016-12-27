import {Component} from '@angular/core';
import {MediaPlugin} from 'ionic-native';
import {DatabaseService} from '../../providers/database';
import {Platform} from "ionic-angular";
import {MessageHandlerService} from "../../providers/messageHandlerService";

declare let cordova: any;


@Component({
  selector: 'page-play-audio',
  templateUrl: 'playAudio.html'
})
export class PlayAudio {

  public currentlyPlayingIndex: number = -1;
  public voiceMessages: Array<{id: number, title: string, date: Date, duration: number, formattedDuration: string}> = [];
  public media;

  private offset: number = 0;
  private limit: number = 20;

  constructor(public database: DatabaseService, public messageHandler: MessageHandlerService, private platform: Platform) {
    platform.ready().then(
      () => {
        this.loadMessages();
      });
  }


  public startPlaying(i) {
    this.currentlyPlayingIndex = i;
    let id = this.voiceMessages[i].id;
    this.media = new MediaPlugin(cordova.file.externalDataDirectory + id + '.mp3');
    try {
      this.media.play();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht abgespielt werden.', e);
      return;
    }
  }

  public stopPlaying() {
    try {
      this.media.pause();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht pausiert werden.', e);
      return;
    }
    this.currentlyPlayingIndex = -1;


  }

  private loadMessages() {
    this.database.getRecordings(this.limit, this.offset).then(
      (recordings) => {
        this.voiceMessages = this.voiceMessages.concat(recordings);
      },
      (error) => {
        this.messageHandler.showAlert('Es konnten keine vorhandenen Aufnahmen geladen werde.', error);
      }
    );
  }
}
