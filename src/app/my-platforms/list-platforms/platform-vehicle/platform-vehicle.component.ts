import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { VehicleService } from '../../../services/vehicle.service'; // Assume this service exists

@Component({
  selector: 'app-platform-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './platform-vehicle.component.html',
  styleUrls: ['./platform-vehicle.component.css']
})
export class PlatformVehicleComponent implements OnInit {
  platformId: string = '';
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.platformId = params['id'];
      this.loadVehicles();
    });
  }

  async loadVehicles() {
    try {
      this.vehicles = await this.vehicleService.listVehicles({ platformID: this.platformId });
      this.filteredVehicles = [...this.vehicles];
      this.loading = false;
    } catch (error) {
      console.error('Error loading vehicles:', error);
      this.loading = false;
    }
  }

  searchVehicles() {
    this.filteredVehicles = this.vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}