import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly STORAGE_KEY = 'authSignInData';
  private readonly ATTRIBUTES_KEY = 'userAttributes';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private tempEmailSubject = new BehaviorSubject<string | null>(null);
  tempEmail$ = this.tempEmailSubject.asObservable();

  private userAttributesSubject = new BehaviorSubject<any>(null);
  userAttributes$ = this.userAttributesSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  private async checkAuthStatus() {
    const data = this.getSignInData();
    const isAuthenticated = !!data;
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      const storedAttributes = this.getStoredAttributes();
      if (storedAttributes) {
        this.userAttributesSubject.next(storedAttributes);
      } else {
        await this.fetchAndStoreUserAttributes();
      }
    }
  }

  async setSignInData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.isAuthenticatedSubject.next(true);
        this.fetchAndStoreUserAttributes().then(resolve).catch(reject);
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
      localStorage.removeItem(this.ATTRIBUTES_KEY);
      this.isAuthenticatedSubject.next(false);
      this.userAttributesSubject.next(null);
    } catch (error) {
      console.error('Error clearing auth data from localStorage:', error);
    }
  }

  setTempEmail(email: string) {
    this.tempEmailSubject.next(email);
  }

  clearTempEmail() {
    this.tempEmailSubject.next(null);
  }

  public async fetchAndStoreUserAttributes(): Promise<any> {
    try {
      const user = await getCurrentUser();
      if (user) {
        const attributes = await fetchUserAttributes();
        this.storeAttributes(attributes);
        this.userAttributesSubject.next(attributes);
        return attributes;
      } else {
        this.userAttributesSubject.next(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      this.userAttributesSubject.next(null);
      return null;
    }
  }

  private storeAttributes(attributes: any): void {
    try {

      localStorage.setItem(this.ATTRIBUTES_KEY, JSON.stringify(attributes));
    } catch (error) {
      console.error('Error storing user attributes in localStorage:', error);
    }
  }

  public getStoredAttributes(): any {
    try {
      const attributes = localStorage.getItem(this.ATTRIBUTES_KEY);
      return attributes ? JSON.parse(attributes) : null;
    } catch (error) {
      console.error('Error retrieving user attributes from localStorage:', error);
      return null;
    }
  }
}