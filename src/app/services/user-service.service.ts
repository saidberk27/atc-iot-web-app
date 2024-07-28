import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { signUp } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private client = generateClient<Schema>();
  private readonly EMAIL_STORAGE_KEY = 'userEmails';

  constructor() { }

  async setEmail(userId: string, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const emails = this.getEmails();
        emails[userId] = email;
        localStorage.setItem(this.EMAIL_STORAGE_KEY, JSON.stringify(emails));
        resolve();
      } catch (error) {
        console.error('Error saving email to localStorage:', error);
        reject(error);
      }
    });
  }

  getEmail(userId: string): string | null {
    try {
      const emails = this.getEmails();
      return emails[userId] || null;
    } catch (error) {
      console.error('Error retrieving email from localStorage:', error);
      return null;
    }
  }

  private getEmails(): { [key: string]: string } {
    const emailsJson = localStorage.getItem(this.EMAIL_STORAGE_KEY);
    return emailsJson ? JSON.parse(emailsJson) : {};
  }

  clearEmail(userId: string): void {
    try {
      const emails = this.getEmails();
      delete emails[userId];
      localStorage.setItem(this.EMAIL_STORAGE_KEY, JSON.stringify(emails));
    } catch (error) {
      console.error('Error clearing email from localStorage:', error);
    }
  }

  createUser(userData: any): Observable<any> {
    return new Observable(observer => {
      this.signUpUser(userData)
        .then(() => {
          return this.client.models.User.create({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            organization: userData.organization
          });
        })
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  private signUpUser(userData: any): Promise<any> {
    return signUp({
      username: userData.email,
      password: userData.password, // Güvenli bir şekilde yönetilmeli
      options: {
        userAttributes: {
          'custom:email': userData.email,
          'custom:firstName': userData.firstName,
          'custom:lastName': userData.lastName,
          'custom:phone': userData.phone,
          'custom:organization': userData.organization // Attribute'leri degistirmek icin cognito->user pools-> sign up experience->custom attributes
        }
      }
    });
  }


}