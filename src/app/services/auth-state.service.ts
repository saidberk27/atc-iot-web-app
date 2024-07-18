import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly STORAGE_KEY = 'authSignInData';

  constructor() { }

  setSignInData(data: any) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving auth data to localStorage:', error);
    }
  }

  getSignInData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving auth data from localStorage:', error);
      return null;
    }
  }

  clearSignInData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth data from localStorage:', error);
    }
  }
}