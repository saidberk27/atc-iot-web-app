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

  async createPlatform(platformData: {
    description: string,
    userID: string,
    buildings?: string[],
    vehicles?: string[]
  }): Promise<any> {
    try {
      // Önce platformu oluştur
      const newPlatform = await this.client.models.Platform.create({
        description: platformData.description,
        userID: platformData.userID
      });

      // Eğer binalar ve araçlar belirtildiyse, bunları platforma bağla
      if (platformData.buildings && platformData.buildings.length > 0) {
        await Promise.all(platformData.buildings.map(buildingId =>
          this.client.models.Building.update({
            id: buildingId,
            platformID: newPlatform.id
          })
        ));
      }

      if (platformData.vehicles && platformData.vehicles.length > 0) {
        await Promise.all(platformData.vehicles.map(vehicleId =>
          this.client.models.Vehicle.update({
            id: vehicleId,
            platformID: newPlatform.id
          })
        ));
      }

      // Oluşturulan platformu döndür
      return {
        id: newPlatform.id,
        description: newPlatform.description,
        userID: newPlatform.userID,
        buildingCount: platformData.buildings?.length || 0,
        vehicleCount: platformData.vehicles?.length || 0
      };
    } catch (error) {
      console.error('Error creating platform:', error);
      throw error;
    }
  }
}