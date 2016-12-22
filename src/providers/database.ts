import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite} from 'ionic-native';

@Injectable()
export class DatabaseService {

  private storage: SQLite;
  private isOpen: boolean;

  constructor(platform: Platform) {
    platform.ready().then(
      () => {
        if (!this.isOpen) {
          this.storage = new SQLite();
          this.storage.openDatabase({name: 'data.db', location: 'default'}).then(() => {
            this.storage.executeSql('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, title TEXT, recordingDate TEXT DEFAULT (strftime(\'%d.%m.%Y %H:%M\', \'now\')))', [])
              .then(
                (data) => {
                  console.log('Table created');
                },
                (error) => {
                  console.log('Table could not be created', error);
                }
              );
            this.isOpen = true;
          });
        }
      });
  }

  public getRecordings(limit: number, offset: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT * FROM recordings ORDER BY id DESC LIMIT ?, ?', [offset, limit]).then((data) => {
        console.log('Data: ', data);
        let recordings: Array<{id: number, title: string, date: string, duration: number}> = [];
        for (let i = 0; i < data.rows.length; i++) {
          let tmpRecording = {
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            date: data.rows.item(i).recordingDate,
            duration: data.rows.item(i).duration
          };
          if(tmpRecording.title === '') {
            tmpRecording.title = 'Sprachnachricht ' + tmpRecording.id;
          }
          recordings.push(tmpRecording);
        }
        resolve(recordings);
      }, (error) => {
        console.log('Error: '+error);
        reject(error);
      });
    });
  }

  public createRecording(title: string, duration: number) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('INSERT INTO recordings (title, duration) VALUES (?, ?)', [title, duration]).then((data) => {
        resolve(data.insertId);
      }, (error) => {
        reject(error);
      });
    });
  }

}
