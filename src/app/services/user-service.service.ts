import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private client = generateClient<Schema>();

  constructor() { }

  createUser(userData: any): Observable<any> {
    return new Observable(observer => {
      this.client.models.User.create({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        organization: userData.organization
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
}