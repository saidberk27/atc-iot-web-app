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

  // Create a new building
  async createBuilding(buildingData: {
    buildingName: string,
    buildingDescription?: string,
    buildingAddress: string,
    platformID: string
  }): Promise<any> {
    try {
      const newBuilding = await this.client.models.Building.create(buildingData);
      return newBuilding;
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  }

  // List all buildings
  async listBuildings(): Promise<any[]> {
    try {
      const response = await this.client.models.Building.list();
      return response.data;
    } catch (error) {
      console.error('Error listing vehicles:', error);
      throw error;


    }

  }

  // Read a single building by ID
  async getBuilding(id: string): Promise<any> {
    try {
      const building = await this.client.models.Building.get({ id });
      return building;
    } catch (error) {
      console.error('Error getting building:', error);
      throw error;
    }
  }

  // Update a building
  async updateBuilding(buildingData: {
    id: string,
    buildingName?: string,
    buildingDescription?: string,
    buildingAddress?: string,
    platformID?: string
  }): Promise<any> {
    try {
      const updatedBuilding = await this.client.models.Building.update(buildingData);
      return updatedBuilding;
    } catch (error) {
      console.error('Error updating building:', error);
      throw error;
    }
  }

  // Delete a building
  async deleteBuilding(id: string): Promise<void> {
    try {
      await this.client.models.Building.delete({ id });
    } catch (error) {
      console.error('Error deleting building:', error);
      throw error;
    }
  }

  // Get units for a building
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