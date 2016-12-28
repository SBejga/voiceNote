import {Component} from '@angular/core';

import {MediaPlugin, File} from 'ionic-native'

import {DatabaseService} from '../../providers/database';
import {MessageHandlerService} from '../../providers/messageHandler';
import {ModalController} from "ionic-angular";
import {TutorialModal} from "../tutorialModal/tutorial";

declare let cordova: any;

@Component({
  selector: 'page-record-audio',
  templateUrl: 'recordAudio.html'
})
export class RecordAudioPage {

  private static NO_RECORDING = 0;
  private static RECORDING_STARTED = 1;
  private static RECORDING_STOPPED = 2;
  private static RECORDING_PLAYED = 3;

  public title: string = '';
  public recordingStatus: number = RecordAudioPage.NO_RECORDING;

  public recordingTimer: string;
  public recordingDuration: number;
  public recordingPosition: number;

  private media: MediaPlugin = null;
  private recordingName: string = 'recording.mp3';
  private startedRecording: Date = null;
  private recordingTimerUpdate: any = null;
  private recordingPlayUpdate: any = null;

  constructor(private database: DatabaseService, private messageHandler: MessageHandlerService,
              private modalController: ModalController) {
  }

  ionViewDidEnter() {
    let modal = this.modalController.create(TutorialModal, {
      imageTexts: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T5'
      ]
    });
    modal.present();
  }

  /*
   * startet eine Aufnahme
   */
  public startRecording() {
    // Die Variablen werden auf ihren Startwert gesetzt
    this.title = '';
    this.recordingTimer = '00:00';
    this.recordingDuration = 0;
    this.recordingPosition = 0;

    this.recordingStatus = RecordAudioPage.RECORDING_STARTED;

    // Läd die entsprechende MP3 Datei und startet sie
    this.media = new MediaPlugin(cordova.file.externalDataDirectory + this.recordingName,
      (status) => {
        if (status === MediaPlugin.MEDIA_RUNNING && this.recordingStatus === RecordAudioPage.RECORDING_STARTED) {
          this.startRecordingAction();
        }
      });
    try {
      this.media.startRecord();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht gestartet werden.', e);
      return;
    }
  }

  /*
   * Startet das Update der Aufnahmelänge
   */
  private startRecordingAction() {
    this.startedRecording = new Date();

    this.recordingTimerUpdate = setInterval(
      () => {
        this.updateRecordingTime();
      }, 1000);
  }

  /*
   * Aktualisiert die momentane Aufnamelänge
   */
  private updateRecordingTime() {
    let now: Date = new Date();
    this.recordingDuration = Math.floor((now.getTime() - this.startedRecording.getTime()) / 1000);
    console.log('update duration: ' + this.recordingDuration);
  }

  /*
   * stoppt die momentane Aufnahme
   */
  public stopRecording() {
    try {
      this.media.stopRecord();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht gestoppt werden.', e);
      return;
    }
    this.updateRecordingTime();
    clearInterval(this.recordingTimerUpdate);

    this.recordingStatus = RecordAudioPage.RECORDING_STOPPED;
    this.recordingPosition = 0;
  }

  /*
   * spielt die zuletzt aufgenommene Memo ab
   */
  public playRecording() {
    try {
      this.media.play();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht abgespielt werden.', e);
      return;
    }

    this.recordingStatus = RecordAudioPage.RECORDING_PLAYED;

    this.recordingPlayUpdate = setInterval(
      () => {
        this.updateRecordingPosition();
      }, 300);
  }

  /*
   * Aktualisiert die Sekundenanzeige der momentan abgespielten Memo
   */
  private updateRecordingPosition() {
    this.media.getCurrentPosition().then(
      (position) => {
        if (position < 0) {
          this.pauseRecording();
          return;
        }
        this.recordingPosition = Math.max(0, Math.floor(position));
        console.log('Recording Position: ' + this.recordingPosition);
      });
  }

  /*
   * Pausiert die abgespielte Memo
   */
  public pauseRecording() {
    clearInterval(this.recordingPlayUpdate);
    this.recordingStatus = RecordAudioPage.RECORDING_STOPPED;
    try {
      this.media.pause();
    } catch (e) {
      this.messageHandler.showAlert('Die Aufnahme konnte nicht pausiert werden.', e);
      return;
    }
  }

  /*
   * Bereitet alles für den Start einer neuen Aufnahme vor
   *
   * @param save: Gibt an, ob die Aufnahme gespeichert werden soll
   */
  public clearRecording(save: boolean) {
    let isPlaying = this.recordingStatus === RecordAudioPage.RECORDING_PLAYED;
    this.recordingStatus = RecordAudioPage.NO_RECORDING;

    if (isPlaying) {
      clearInterval(this.recordingPlayUpdate);
      try {
        this.media.stop();
      } catch (e) {
        this.messageHandler.showAlert('Die Aufnahme konnte nicht gestoppt werden.', e);
      }
    }

    if (save) {
      this.saveRecording();
    }
    this.media = null;
  }

  /*
   * Speichert die momentane Aufnahme
   */
  private saveRecording() {
    this.database.createRecording(this.title, this.recordingDuration)
      .then(
        (insertId) => {
          File.moveFile(cordova.file.externalDataDirectory, this.recordingName, cordova.file.externalDataDirectory, insertId + '.mp3')
            .then(
              () => {
                this.messageHandler.showSuccessToast('Die Aufnahme wurde gespeichert.');
              },
              (error) => {
                this.messageHandler.showAlert('Die Aufnahme konnte nicht gespeichert werden.', error);
              }
            );
        },
        (error) => {
          this.messageHandler.showAlert('Die Aufnahme konnte nicht gespeichert werden.', error);
        }
      )
  }

  /*
   * Springt zu der übergebenen Position
   *
   * @param position: die zu setzende Position in Sekunden
   */
  public setCurrentPosition(position) {
    this.recordingPosition = position;
    this.media.seekTo(this.recordingPosition * 1000);
  }

}
