import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  flagIsAuth = false;
  userInfo = {};

  constructor() { }

  // TODO: call API and get auth
  login(username: string, password: string): boolean {
    if (username && password) {
      if ( username === 'tester' && password === '12345678' ){
        this.flagIsAuth = true;
        this.userInfo = { // TODO: use NGRX store user info into store.
          username,
          token: 'TODO: token here'
        };
      } else {
        this.flagIsAuth = false;
      }
    } else {
      this.flagIsAuth = false;
    }
    return this.flagIsAuth;
  }

  isAuth(): boolean {
    return this.flagIsAuth;
  }
}
