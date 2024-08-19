import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private client: any;

  constructor() {
    this.client = generateClient();
  }

  async listPlatforms(): Promise<any[]> {
    try {
      const platforms = await this.client.models.Platform.list();
      console.log(platforms);
      return platforms.data.map((platform: { id: any; description: any; }) => ({
        id: platform.id,
        description: platform.description
      }));


    } catch (error) {
      console.error('Error listing platforms:', error);
      throw error;
    }
  }
}