import {Component} from '@angular/core';

import {MediaPlugin, File} from 'ionic-native'

import {DatabaseService} from '../../providers/database';
import {ErrorHandlerService} from '../../providers/errorHandler';

declare let cordova: any;

@Component({
  selector: 'page-record-audio',
  templateUrl: 'recordAudio.html'
})
export class RecordAudioPage {

  public title: string = '';
  public recordingStatus: number = 0;

  public recordingTimer: string;
  public recordingDuration: number;
  public recordingPosition: number;

  private media: MediaPlugin = null;
  private recordingName: string = 'recording.mp3';
  private startedRecording: Date = null;
  private recordingTimerUpdate: any = null;
  private recordingPlayUpdate: any = null;

  constructor(private database: DatabaseService, private errorHandler: ErrorHandlerService) {
  }

  public startRecording() {

    this.recordingTimer = '00:00';
    this.recordingDuration = 0;
    this.recordingPosition = 0;

    this.media = new MediaPlugin(cordova.file.externalDataDirectory + this.recordingName);
    // TODO: Request permissions
    try {
      this.media.startRecord();
    } catch (e) {
      this.errorHandler.showAlert('Die Aufnahme konnte nicht gestartet werden.', e);
      return;
    }

    this.startedRecording = new Date();
    this.recordingStatus = 1;

    this.recordingTimerUpdate = setInterval(
      () => {
        this.updateRecordingTime();
      }, 1000);
  }

  public stopRecording() {
    this.updateRecordingTime();
    clearInterval(this.recordingTimerUpdate);
    try {
      this.media.stopRecord();
    } catch (e) {
      this.errorHandler.showAlert('Die Aufnahme konnte nicht gestoppt werden.', e);
      return;
    }

    this.recordingPosition = 0;
    this.recordingStatus = 2;
  }

  public playRecording() {
    if (this.recordingDuration <= this.recordingPosition) {
      this.setCurrentPosition(0);
    }

    try {
      this.media.play();
    } catch (e) {
      this.errorHandler.showAlert('Die Aufnahme konnte nicht abgespielt werden.', e);
      return;
    }

    this.recordingStatus = 3;

    this.recordingPlayUpdate = setInterval(
      () => {
        this.media.getCurrentPosition().then(
          (position) => {
            if (position < 0) {
              this.pauseRecording();
              return;
            }
            this.recordingPosition = Math.max(0, Math.floor(position));
          });
      }, 100);
  }

  public pauseRecording() {
    try {
      this.media.pause();
    } catch (e) {
      this.errorHandler.showAlert('Die Aufnahme konnte nicht pausiert werden.', e);
      return;
    }

    this.recordingStatus = 2;
    clearInterval(this.recordingPlayUpdate);
  }

  public newRecording(save: boolean) {
    try {
      this.media.stop();
    } catch (e) {
      this.errorHandler.showAlert('Die Aufnahme konnte nicht gestoppt werden.', e);
    }

    if (this.recordingStatus === 3) {
      clearInterval(this.recordingPlayUpdate);
    }

    if(save) {
      this.database.createRecording(this.title, this.recordingDuration)
        .then(
          (insertId) => {
            File.moveFile(cordova.file.externalDataDirectory, this.recordingName, cordova.file.externalDataDirectory, insertId+'.mp3');
          },
          (error) => {
            this.errorHandler.showAlert('Die Aufnahme konnte nicht gespeichert werden.', error);
          }
        )
    }

    this.recordingStatus = 0;
  }

  public setCurrentPosition(position) {
    this.recordingPosition = position;
    this.media.seekTo(this.recordingPosition * 1000);
  }

  private updateRecordingTime() {
    let now: Date = new Date();
    this.recordingDuration = Math.floor((now.getTime() - this.startedRecording.getTime()) / 1000);

    let seconds: number = this.recordingDuration;
    if (seconds >= 3600) {
      this.stopRecording();
      return;
    }

    let time: string = '';
    if (seconds >= 600) {
      time += Math.floor(seconds / 60);
    } else if (seconds >= 60) {
      time += '0' + Math.floor(seconds / 60);
    } else {
      time += '00';
    }

    seconds %= 60;
    time += ':';

    if (seconds >= 10) {
      time += seconds;
    } else {
      time += '0' + seconds;
    }

    this.recordingTimer = time;
  }

}
