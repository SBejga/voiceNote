import {Injectable} from '@angular/core';

/*
 * Speichert den momentan eingeloggten Benutzer, um ihn überall verfügbar zu machen
 */
@Injectable()
export class AuthorizerService {

  private user = null;

  constructor() {
  }

  /*
   * Gibt zurück, ob ein Nutzer eingeloggt ist
   * @return: true, falls jemand eingeloggt ist, ansonsten false
   */
  public isLoggedIn(): boolean {
    return this.user === null;
  }

  /*
   * Gibt den momentan eingeloggten Nutzer zurück
   */
  public getUser() {
    return this.user;
  }

  /*
   * Speichert den eingeloggten Nutzer
   */
  public setUser(user) {
    this.user = user;
  }
}
