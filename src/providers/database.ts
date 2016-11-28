import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite} from 'ionic-native';

@Injectable()
export class Database {

  private storage: SQLite;
  private isOpen: boolean;

  constructor(platform: Platform) {
    platform.ready().then(
      () => {
        if (!this.isOpen) {
          this.storage = new SQLite();
          this.storage.openDatabase({name: 'data.db', location: 'default'}).then(() => {
            this.storage.executeSql('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, title TEXT, recordingDate TEXT DEFAULT (datetime(\'now\', \'localtime\')))', [])
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
      this.storage.executeSql('SELECT * FROM recordings LIMIT ?, ?', [offset, limit]).then((data) => {
        console.log('Data: ', data);
        let recordings: Array<{id: number, title: string, date: Date, duration: number}> = [];
        for (let i = 0; i < data.rows.length; i++) {
          recordings.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            date: new Date(data.rows.item(i).recordingDate),
            duration: data.rows.item(i).duration
          });
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
