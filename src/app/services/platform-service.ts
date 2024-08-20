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
          platformName: platform.platformName, // Eklendi
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
    platformName: string,
    description: string,
    userID: string,
    buildings?: string[],
    vehicles?: string[]
  }): Promise<any> {
    try {
      // Platformu oluştur
      const newPlatform = await this.client.models.Platform.create({
        platformName: platformData.platformName,
        description: platformData.description,
        userID: platformData.userID
      });

      // Yeni oluşturulan platformun ID'sini al
      const platformID = newPlatform.data.id;
      // Buildings ve vehicles'ı güncelle
      if (platformData.buildings) {
        await Promise.all(platformData.buildings.map(async (buildingId) => {
          await this.client.models.Building.update({
            id: buildingId,
            platformID: platformID
          });
        }));
      }

      if (platformData.vehicles) {
        await Promise.all(platformData.vehicles.map(async (vehicleId) => {
          await this.client.models.Vehicle.update({
            id: vehicleId,
            platformID: platformID
          });
        }));
      }

      return newPlatform;
    } catch (error) {
      console.error("Error creating platform:", error);
      throw error;
    }
  }
}