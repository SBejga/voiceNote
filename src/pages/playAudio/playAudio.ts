import {Component} from '@angular/core';
import {MediaPlugin} from 'ionic-native';
import {DatabaseService} from '../../providers/database';
import {MessageHandlerService} from '../../providers/messageHandler';

declare let cordova: any;

@Component({
  selector: 'page-play-audio',
  templateUrl: 'playAudio.html'
})
export class PlayAudio {

  public currentlyPlayingIndex: number = -1;
  public currentlyPausedIndex: number = -1;
  public currentPosition: number = 0;

  public firstMessagesLoaded: boolean = false;
  public loadedAllMessages: boolean = false;

  public voiceMessages: Array<{id: number, title: string, date: Date, duration: number, formattedDuration: string}> = [];

  private currentlyPlayingUpdate: any = null;
  private media: MediaPlugin = null;

  private offset: number = 0;
  private limit: number = 20;

  constructor(public database: DatabaseService, public messageHandler: MessageHandlerService) {
  }

  //noinspection JSUnusedGlobalSymbols
  /*
   * Läd die ersten Dateien
   */
  ionViewWillEnter() {
    this.loadMessages();
  }

  /*
   * Läd mit Paginierung die existierenden Dateien
   */
  public loadMessages() {
    this.database.getRecordings(this.limit, this.offset).then(
      (recordings) => {
        console.log(recordings);

        this.voiceMessages = this.voiceMessages.concat(recordings);
        this.offset += this.limit;

        this.firstMessagesLoaded = true;
        if (recordings.length < this.limit) {
          this.loadedAllMessages = true;
        }
      },
      (error) => {
        this.messageHandler.showAlert('Es konnten keine vorhandenen Aufnahmen geladen werde.', error);
      }
    );
  }

  /*
   * startet die ausgewählte Memo
   */
  public startPlaying(i) {
    // Falls die ausgewählte Memo nur pausiert ist, spiele sie weiter
    if (this.currentlyPausedIndex === i) {
      this.currentlyPlayingIndex = this.currentlyPausedIndex;
      this.currentlyPausedIndex = -1;

      try {
        this.media.play();
      } catch (e) {
        this.messageHandler.showAlert('Die ausgewählte Memo kann momentan nicht abgespielt werden.', e);
      }

      this.currentlyPlayingUpdate = setInterval(
        () => {
          this.updateRecordingPosition();
        }, 300);
      return;
    }

    // Falls eine andere Memo momentan läuft, stoppe diese
    if (this.currentlyPlayingIndex !== -1) {
      clearInterval(this.currentlyPlayingUpdate);
      try {
        this.media.stop();
      } catch (e) {
        this.messageHandler.showAlert('Die aktuelle Aufnahme konnte nicht gestoppt werden.', e);
        return;
      }
    }

    this.currentlyPlayingIndex = i;
    this.currentlyPausedIndex = -1;
    this.currentPosition = 0;

    // Läd die entsprechende MP3 Datei ..
    let id = this.voiceMessages[i].id;
    this.media = new MediaPlugin(cordova.file.externalDataDirectory + id + '.mp3');

    // .. und spielt sie ab
    try {
      this.media.play();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht abgespielt werden.', e);
      return;
    }

    /*
     * aktualisiert alle 300ms die Sekundenanzeige
     */
    this.currentlyPlayingUpdate = setInterval(
      () => {
        this.updateRecordingPosition();
      }, 300);
  }

  /*
   * aktualisiert die Sekundenanzeige der momentan abgespielten Memo
   */
  private updateRecordingPosition() {
    this.media.getCurrentPosition().then(
      (position) => {
        this.currentPosition = Math.max(0, Math.floor(position));

        // wenn Memo zu Ende gehört wurde -> position = -1
        if(position < 0) {
          this.currentlyPlayingIndex = -1;
        }
      });
  }

  /*
   * Pausiert die momentan laufende Memo
   */
  public pausePlaying() {
    try {
      clearInterval(this.currentlyPlayingUpdate);
      this.media.pause();
      this.currentlyPausedIndex = this.currentlyPlayingIndex;
      this.currentlyPlayingIndex = -1;
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht pausiert werden.', e);
      return;
    }
  }

  /*
   * Springt in der aktuellen Memo zu der ausgewählten Stelle
   */
  public setCurrentPosition(position) {
    this.currentPosition = position;
    this.media.seekTo(this.currentPosition * 1000);
  }

}
