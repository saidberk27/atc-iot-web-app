import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly STORAGE_KEY = 'authSignInData';

  constructor() { }

  async setSignInData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        resolve();
      } catch (error) {
        console.error('Error saving auth data to localStorage:', error);
        reject(error);
      }
    });
  }

  getSignInData(): any {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving auth data from localStorage:', error);
      return null;
    }
  }

  clearSignInData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth data from localStorage:', error);
    }
  }
}