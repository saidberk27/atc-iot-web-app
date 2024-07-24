import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  async createUser(user: {
    userId: string;
    userName: string;
    userSurname: string;
    userMail: string;
    userPhone?: string;
  }) {
    try {
      const newUser = await client.models.User.create(user);
      console.log('New user created:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}