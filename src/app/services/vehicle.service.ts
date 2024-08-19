import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private client: any;

  constructor() {
    this.client = generateClient();
  }

  // Create a new vehicle
  async createVehicle(vehicleData: {
    vehicleName: string;
    vehiclePlateNumber: string;
    vehicleDescription?: string;
    platformID: string;
  }): Promise<any> {
    try {
      const newVehicle = await this.client.models.Vehicle.create({
        vehicleName: vehicleData.vehicleName,
        vehiclePlateNumber: vehicleData.vehiclePlateNumber,
        vehicleDescription: vehicleData.vehicleDescription,
        platformID: vehicleData.platformID
      });
      return newVehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  // Get a vehicle by ID
  async getVehicle(id: string): Promise<any> {
    try {
      return await this.client.models.Vehicle.get(id);
    } catch (error) {
      console.error('Error getting vehicle:', error);
      throw error;
    }
  }

  // List all vehicles
  async listVehicles(): Promise<any[]> {
    try {
      return await this.client.models.Vehicle.list();
    } catch (error) {
      console.error('Error listing vehicles:', error);
      throw error;
    }
  }

  // Update a vehicle
  async updateVehicle(id: string, vehicleData: any): Promise<any> {
    try {
      const existingVehicle = await this.client.models.Vehicle.get(id);
      return await this.client.models.Vehicle.update({
        ...existingVehicle,
        ...vehicleData
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Delete a vehicle
  async deleteVehicle(id: string): Promise<any> {
    try {
      const vehicleToDelete = await this.client.models.Vehicle.get(id);
      return await this.client.models.Vehicle.delete(vehicleToDelete);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}