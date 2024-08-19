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

  async listPlatforms(userID: string): Promise<any[]> {
    try {
      console.log(userID);
      const platforms = await this.client.models.Platform.list({
        filter: { userID: { eq: userID } }
      });

      return await Promise.all(platforms.data.map(async (platform: any) => {
        const buildings = await this.client.models.Building.list({
          filter: { platformID: { eq: platform.id } }
        });
        const vehicles = await this.client.models.Vehicle.list({
          filter: { platformID: { eq: platform.id } }
        });
        return {
          id: platform.id,
          description: platform.description,
          buildingCount: buildings.data.length,
          vehicleCount: vehicles.data.length,
          userID: platform.userID
        };
      }));
    } catch (error) {
      console.error('Error listing platforms:', error);
      throw error;
    }
  }
}