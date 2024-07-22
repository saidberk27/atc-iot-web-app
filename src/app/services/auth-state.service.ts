import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly STORAGE_KEY = 'authSignInData';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const data = this.getSignInData();
    this.isAuthenticatedSubject.next(!!data);
  }

  async setSignInData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.isAuthenticatedSubject.next(true);
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
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      console.error('Error clearing auth data from localStorage:', error);
    }
  }
}