import {Injectable, ErrorHandler} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite} from 'ionic-native';
import CryptoJS from 'crypto-js';
import {AuthorizerService} from './authorizer';

/*
 * Schnittstelle zur SQLite Datenbank
 */
@Injectable()
export class DatabaseService {

  private storage: SQLite;
  private isOpen: boolean;

  constructor(private platform: Platform, private authorizer: AuthorizerService, private errorHandler: ErrorHandler) {
  }

  /*
   * Intiialisiert die Tabellen
   */
  public init(): Promise<any> {
    if (this.isOpen) {
      return new Promise(
        (resolve, reject) => {
          resolve();
        }
      );
    }

    this.storage = new SQLite();

    return this.storage.openDatabase({name: 'data.db', location: 'default'}).then(() => {
      this.isOpen = true;
      return Promise.all([
        this.storage.executeSql('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, duration INTEGER, title TEXT, recordingDate TEXT DEFAULT (strftime(\'%d.%m.%Y %H:%M\', \'now\')))', []),
        this.storage.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, is_logged_in INTEGER DEFAULT 0)', [])
      ]);
    });
  }

  /*
   * Sucht eine gewünschte Anzahl an Aufnahmedaten
   *
   * @param limit: Das Limit für die Paginierung
   * @param offset: Das offset für die Paginierung
   *
   * @return: Gibt ein Promise zurück, welches entweder mit einer gewisse Anzahl an Aufnahmedaten aufgelöst wird oder einen Fehler weiterleitet.
   */
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
          this.errorHandler.handleError(error);
          reject(error);
        });
    });
  }

  /*
   * Fügt eine neue Aufnahme in die Datenbank ein
   *
   * @param title: Der Titel der neuen Aufnahme
   * @param duration: Die Dauer der neuen Aufnahme
   *
   * Gibt ein Promise zurück, welches entweder mit der ID der neuen Datei aufgelöst wird oder einen Fehler weiterleitet.
   */
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

  /*
   * Findet einen gewünschten Benutzer
   *
   * @param username: Der Benutzername des zu findenden Nutzers
   *
   * Gibt ein Promise zurück, welches entweder mit den Benutzerdaten aufgelöst wird oder einen Fehler weiterleitet.
   */
  private getUserUnverified(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT id, username, password FROM user WHERE UPPER(username) LIKE ?', [username.toUpperCase()])
        .then((userData) => {
          if (userData.rows.length === 0) {
            resolve(null);
            return;
          }
          resolve(userData);
        }, (error) => {
          this.errorHandler.handleError(error);
          reject(error);
        });
    });
  }

  /*
   * Findet den eingeloggten Benutzer, falls einer existiert
   *
   * Gibt ein Promise zurück, welches entweder mit dem eingeloggten Benutzer oder null, falls niemand eingeloggt ist, aufgelöst wird oder einen Fehler weiterleitet.
   */
  public getLoggedInUser(): Promise<any> {
    console.log("open: ", this.isOpen);
    return new Promise((resolve, reject) => {
      this.storage.executeSql('SELECT id, username FROM user WHERE is_logged_in = 1', [])
        .then((userData) => {
          if (userData.rows.length === 0) {
            resolve(null);
            return;
          }

          let user: {id: any, username: any} = {
            id: userData.rows.item(0).id,
            username: userData.rows.item(0).username
          };

          resolve(user);
        }, (error) => {
          this.errorHandler.handleError(error);
          reject(error);
        });
    });
  }

  /*
   * Speichert einen Benutzer als eingeloggt
   *
   * @param id: Die ID des gewünschten Nutzers
   *
   * Gibt ein Promise zurück, welches entweder aufgelöst wird oder einen Fehler weiterleitet.
   */
  public setUserLoggedIn(id: number) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql('UPDATE user SET is_logged_in = CASE WHEN id = ? THEN 1 ELSE 0 END', [id])
        .then(
          () => {
            resolve();
          },
          (error) => {
            this.errorHandler.handleError(error);
            reject(error);
          }
        );
    });
  }

  /*
   * Findet einen gewünschten Benutzer und verifiziert sein Passwort
   *
   * @param username: Der Benutzername des zu findenden Nutzers
   * @param password: Das Passwort des zu findenden Nutzers
   *
   * Gibt ein Promise zurück, welches entweder mit dem Benutzer aufgelöst wird oder einen Fehler weiterleitet.
   */
  public getUser(username: string, password): Promise<any> {
    return this.getUserUnverified(username).then(
      (userData) => {
        if (userData === null) {
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
    );
  }

  /*
   * Fügt einen neue Nutzer in die Datenbank ein
   *
   * @param username: Der Benutzername des neuen Nutzers
   * @param password: Das Passwort des neuen Nutzers
   *
   * Gibt ein Promise zurück, welches entweder mit der ID des neuen Nutzers aufgelöst wird oder einen Fehler weiterleitet.
   */
  public createUser(username: string, password: string) {
    return this.getUserUnverified(username).then(
      (userData) => {
        if (userData !== null) {
          return -1;
        }

        let salt = DatabaseService.randomString(16);
        return this.storage.executeSql('INSERT INTO user (username, password, is_logged_in) VALUES (?, ?, 1)', [username, salt + CryptoJS.SHA512(password + salt)])
          .then((data) => {
            return data.insertId;
          });
      }
    );
  }

  /*
   * Erzeugt einen zufälligen String
   *
   * @param length: Die Länge des zu erzeugenden Strings
   * @param possible: Die Zeichen, welche in dem String vorhanden sein sollen
   *
   * @return: Der erzeugte String
   */
  private static randomString(length: number, possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
    let text = "";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
