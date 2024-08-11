import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VehicleService } from '../../services/vehicle.service';


interface Vehicle {
  id: string;
  vehicleName: string;
  vehiclePlateNumber: string;
  vehicleDescription?: string;
  systemID: string;
}

@Component({
  selector: 'app-list-vehicles',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.css'
})
export class ListVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  displayDialog = false;
  selectedVehicle: Vehicle | null = null;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    try {
      const result = await this.vehicleService.listVehicles();

      this.vehicles = Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch vehicles' });
    }
  }

  openDialog(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.displayDialog = true;
  }

  updateVehicle() {
    if (this.selectedVehicle) {
      // Implement update logic here
      console.log('Update vehicle:', this.selectedVehicle);
      this.messageService.add({ severity: 'info', summary: 'Update', detail: 'Update functionality not implemented yet' });
    }
    this.displayDialog = false;
  }

  async deleteVehicle() {
    if (this.selectedVehicle) {
      try {
        await this.vehicleService.deleteVehicle(this.selectedVehicle.id);
        this.vehicles = this.vehicles.filter(v => v.id !== this.selectedVehicle!.id);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Vehicle deleted successfully' });
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vehicle' });
      }
    }
    this.displayDialog = false;
  }

  viewVehicleDetails() {
    if (this.selectedVehicle) {
      // Implement view details logic here
      console.log('View details of vehicle:', this.selectedVehicle);
      this.messageService.add({ severity: 'info', summary: 'View Details', detail: 'View details functionality not implemented yet' });
    }
    this.displayDialog = false;
  }
}