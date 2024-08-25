import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private client: any;

  constructor() {
    this.client = generateClient();
  }

  async createBuilding(buildingData: {
    buildingName: string;
    buildingAddress: string;
    buildingDescription?: string;
    platformID: string;
    userID: string;
  }): Promise<any> {
    try {
      const newBuilding = await this.client.models.Building.create({
        buildingName: buildingData.buildingName,
        buildingAddress: buildingData.buildingAddress,
        buildingDescription: buildingData.buildingDescription,
        platformID: buildingData.platformID,
        userID: buildingData.userID
      });
      return newBuilding;
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  }

  async getBuilding(id: string): Promise<any> {
    try {
      return await this.client.models.Building.get(id);
    } catch (error) {
      console.error('Error getting building:', error);
      throw error;
    }
  }

  async listBuildings(): Promise<any[]> {
    try {
      const response = await this.client.models.Building.list();
      return response.data;
    } catch (error) {
      console.error('Error listing buildings:', error);
      throw error;
    }
  }

  async updateBuilding(id: string, buildingData: any): Promise<any> {
    try {
      const existingBuilding = await this.client.models.Building.get(id);
      return await this.client.models.Building.update({
        ...existingBuilding,
        ...buildingData
      });
    } catch (error) {
      console.error('Error updating building:', error);
      throw error;
    }
  }

  async deleteBuilding(id: string): Promise<any> {
    try {
      const buildingToDelete = await this.client.models.Building.get(id);
      return await this.client.models.Building.delete(buildingToDelete);
    } catch (error) {
      console.error('Error deleting building:', error);
      throw error;
    }
  }

  async getBuildingUnits(buildingID: string): Promise<any[]> {
    try {
      const units = await this.client.models.Unit.list({
        filter: { buildingID: { eq: buildingID } }
      });
      return units.data;
    } catch (error) {
      console.error('Error getting building units:', error);
      throw error;
    }
  }
}