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
    userID: string;
  }): Promise<any> {
    try {
      const newVehicle = await this.client.models.Vehicle.create({
        vehicleName: vehicleData.vehicleName,
        vehiclePlateNumber: vehicleData.vehiclePlateNumber,
        vehicleDescription: vehicleData.vehicleDescription,
        platformID: vehicleData.platformID,
        userID: vehicleData.userID
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
  async listVehicles({ platformID, userID }: { platformID?: string; userID?: string } = {}): Promise<any[]> {
    try {
      //TODO Araclarda niye Unit Kismi var? islevsel hale getir.
      let filter: any = {};

      if (platformID) {
        filter.platformID = { eq: platformID };
        console.log("Platform ID used.")
      }

      if (userID) {
        filter.userID = { eq: userID };
        console.log("user ID used.")

      }

      // If both are provided, we'll use 'and' condition
      if (platformID && userID) {
        console.log("both ID used.")
        filter = {
          and: [
            { platformID: { eq: platformID } },
            { userID: { eq: userID } }
          ]
        };
      }
      console.log(filter);

      const vehicles = await this.client.models.Vehicle.list({ filter });
      console.log(vehicles);
      return vehicles.data.map((vehicle: any) => ({
        id: vehicle.id,
        vehicleName: vehicle.vehicleName,
        description: vehicle.vehicleDescription,
        plateNumber: vehicle.vehiclePlateNumber,
        platformID: vehicle.platformID,
        userID: vehicle.userID,
        createdAt: vehicle.createdAt
      }));

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

