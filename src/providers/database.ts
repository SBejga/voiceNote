import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite} from 'ionic-native';
import CryptoJS from 'crypto-js';
import {AuthorizerService} from './authorizer';

@Injectable()
export class DatabaseService {

  private storage: SQLite;
  private isOpen: boolean;

  constructor(private platform: Platform, private authorizer: AuthorizerService) {
    platform.ready().then(
      () => {
        if (!this.isOpen) {
          this.storage = new SQLite();
          this.storage.openDatabase({name: 'data.db', location: 'default'}).then(() => {
            this.storage.executeSql('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, duration INTEGER, title TEXT, recordingDate TEXT DEFAULT (strftime(\'%d.%m.%Y %H:%M\', \'now\')))', [])
              .then(
                () => {
                  console.log('Table recordings created');
                },
                (error) => {
                  console.log('Table recordings could not be created', error);
                }
              );
            this.storage.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)', [])
              .then(
                () => {
                  console.log('Table user created');
                },
                (error) => {
                  console.log('Table user could not be created', error);
                }
              );
            this.isOpen = true;
          });
        }
      });
  }

  public getRecordings(limit: number, offset: number): Promise<any> {
    let userId = this.authorizer.getUser().id;
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT * FROM recordings WHERE user_id=? ORDER BY id DESC LIMIT ?, ?', [userId, offset, limit])
        .then((data) => {
          let recordings: Array<{id: number, title: string, date: string, duration: number}> = [];
          for (let i = 0; i < data.rows.length; i++) {
            let tmpRecording = {
              id: data.rows.item(i).id,
              title: data.rows.item(i).title,
              date: data.rows.item(i).recordingDate,
              duration: data.rows.item(i).duration
            };
            if (tmpRecording.title === '') {
              tmpRecording.title = 'Sprachnachricht ' + tmpRecording.id;
            }
            recordings.push(tmpRecording);
          }
          resolve(recordings);
        }, (error) => {
          console.log('Error: ' + error);
          reject(error);
        });
    });
  }

  public createRecording(title: string, duration: number): Promise<any> {
    let userId = this.authorizer.getUser().id;
    return new Promise((resolve, reject) => {
      this.storage.executeSql('INSERT INTO recordings (title, duration, user_id) VALUES (?, ?, ?)', [title, duration, userId])
        .then((data) => {
          resolve(data.insertId);
        }, (error) => {
          reject(error);
        });
    });
  }

  private getUserUnverified(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT * FROM user WHERE UPPER(username) LIKE ?', [username.toUpperCase()])
        .then((userData) => {
          if (userData.rows.length === 0) {
            resolve(null);
            return;
          }
          resolve(userData);
        }, (error) => {
          console.log('Error: ' + error);
          reject(error);
        });
    });
  }

  public getUser(username: string, password): Promise<any> {
    return this.getUserUnverified(username).then(
      (userData) => {
        if(userData===null) {
          return null;
        }
        let passwordEncrypted = userData.rows.item(0).password;
        let salt = passwordEncrypted.substring(0, 16);
        let hash = passwordEncrypted.substring(16);
        if (hash !== CryptoJS.SHA512(password + salt).toString()) {
          return null;
        }

        let user: {id: any, username: any} = {
          id: userData.rows.item(0).id,
          username: userData.rows.item(0).username
        };

        return user;
      }
    )
  }

  public createUser(username: string, password: string) {
    return this.getUserUnverified(username).then(
      (userData) => {
        if (userData !== null) {
          return -1;
        }

        let salt = DatabaseService.randomString(16);
        return this.storage.executeSql('INSERT INTO user (username, password) VALUES (?, ?)', [username, salt + CryptoJS.SHA512(password + salt)])
          .then((data) => {
            return data.insertId;
          });
      }
    );
  }

  private static randomString(length: number, possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
    let text = "";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
