import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private signInData: any;

  constructor() { }

  setSignInData(data: any) {
    this.signInData = data;
  }

  getSignInData() {
    return this.signInData;
  }

  clearSignInData() {
    this.signInData = null;
  }
}