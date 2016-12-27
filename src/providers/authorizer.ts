import {Injectable} from '@angular/core';

@Injectable()
export class AuthorizerService {

  private user = null;

  constructor() {
  }

  public isLoggedIn(): boolean {
    return this.user === null;
  }

  public getUser() {
    return this.user;
  }

  public setUser(user) {
    this.user = user;
  }
}
