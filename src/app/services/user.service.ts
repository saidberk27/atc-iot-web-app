import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { signUp, fetchUserAttributes } from 'aws-amplify/auth';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userAttributes: any;
  private client = generateClient<Schema>();
  private readonly EMAIL_STORAGE_KEY = 'userEmails';

  constructor(private authService: AuthStateService) { }

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
  //NOTE: Create user DynamoDB'ye kayıt için cognito ID alıyor, kendi otomatik ID'si ile kaydetmiyor, uygulama mimarisi bu şekilde eğer değişirse platformlar listelenemez.
  async createUser(userData: any): Promise<any> {
    try {
      this.userAttributes = await this.authService.getStoredAttributes();
      if (!this.userAttributes) {
        this.userAttributes = await fetchUserAttributes();
      }
      const userRole = this.userAttributes['custom:role'];

      if (userRole !== 'Admin') {
        throw new Error('Yalnızca adminler kullanıcı ekleyebilir.');
      }

      // signUpUser fonksiyonundan Cognito ID'yi al
      const cognitoUser = await this.signUpUser(userData);

      console.log(cognitoUser.userId);
      const cognitoUserId = cognitoUser.userId; // Cognito'nun döndürdüğü user ID

      if (!cognitoUserId) {
        throw new Error('Cognito kullanıcı ID alınamadı.');
      }

      const newUser = await this.client.models.User.create({
        id: cognitoUserId, // Cognito ID'yi User modelinin id'si olarak kullan
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        organization: userData.organization,
        userRole: userData.role
      });

      return newUser;
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      throw error;
    }
  }

  private async signUpUser(userData: any): Promise<any> {
    console.log(userData.firstName)
    return signUp({
      username: userData.email,
      password: userData.password,
      options: {
        userAttributes: {
          email: userData.email,
          'custom:firstName': userData.firstName,
          'custom:lastName': userData.lastName,
          'custom:phone': userData.phone,
          'custom:organization': userData.organization,
          'custom:role': userData.role
        }
      }
    });
  }
}