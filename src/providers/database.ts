import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite} from 'ionic-native';

@Injectable()
export class Database {

  private storage: SQLite;
  private isOpen: boolean;

  public constructor(platform: Platform) {
    platform.ready().then(
      () => {
        if (!this.isOpen) {
          this.storage = new SQLite();
          this.storage.openDatabase({name: 'data.db', location: 'default'}).then(() => {
            this.storage.executeSql('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, synchronized INTEGER)', []);
            this.isOpen = true;
          });
        }
      });
  }


  public getRecordings(limit: number, offset: number) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT * FROM recordings LIMIT ?, ?', [offset, limit]).then((data) => {
        let recordings = [];
        for (let i = 0; i < data.rows.length; i++) {
          recordings.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            path: data.rows.item(i).path,
            synchronized: data.rows.item(i).synchronized > 0
          });
        }
        resolve(recordings);
      }, (error) => {
        reject(error);
      });
    });
  }

  public createRecording(title: string, synchronized: boolean) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('INSERT INTO recordings (title, synchronized) VALUES (?, ?)', [title, synchronized]).then((data) => {
        resolve(data.insertId);
      }, (error) => {
        reject(error);
      });
    });
  }

}
