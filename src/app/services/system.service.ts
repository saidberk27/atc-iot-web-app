import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private client: any;

  constructor() {
    this.client = generateClient();
  }

  async listSystems(): Promise<any[]> {
    try {
      const systems = await this.client.models.System.list();
      console.log(systems);
      return systems.data.map((system: { id: any; description: any; }) => ({
        id: system.id,
        description: system.description
      }));


    } catch (error) {
      console.error('Error listing systems:', error);
      throw error;
    }
  }
}