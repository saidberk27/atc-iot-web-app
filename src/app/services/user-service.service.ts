import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { signUp, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

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

  async createUser(userData: any): Promise<any> {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      const userRole = userAttributes['custom:role'];

      if (userRole !== 'Admin') {
        throw new Error('Yalnızca adminler kullanıcı ekleyebilir.');
      }

      await this.signUpUser(userData);

      const newUser = await this.client.models.User.create({
        email: userData['custom:email'],
        firstName: userData['custom:firstName'],
        lastName: userData['custom:lastName'],
        phone: userData['custom:phone'],
        organization: userData['custom:organization'],
        userRole: userData['custom:role']
      });

      return newUser;
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      throw error;
    }
  }

  private async signUpUser(userData: any): Promise<any> {
    return signUp({
      username: userData['custom:email'],
      password: userData.password,
      options: {
        userAttributes: {
          'custom:email': userData['custom:email'],
          'custom:firstName': userData['custom:firstName'],
          'custom:lastName': userData['custom:lastName'],
          'custom:phone': userData['custom:phone'],
          'custom:organization': userData['custom:organization'],
          'custom:role': userData['custom:role']
        }
      }
    });
  }
}