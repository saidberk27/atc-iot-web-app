import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { PlatformService } from '../../services/platform-service';
import { BuildingService } from '../../services/building.service';
import { VehicleService } from '../../services/vehicle.service';
import { MessageService } from 'primeng/api';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';

interface BuildingOption {
  id: string;
  name: string;
}

interface VehicleOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-new-platform',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessagesModule,
    MessageModule,
    ToastModule,

    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './add-new-platform.component.html',
  styleUrls: ['./add-new-platform.component.css']
})
export class AddNewPlatformComponent implements OnInit {
  private userID: string = '';
  platformForm: FormGroup;
  buildingOptions: BuildingOption[] = [];
  vehicleOptions: VehicleOption[] = [];

  selectedBuildings: BuildingOption[] = [];
  selectedVehicles: VehicleOption[] = [];
  filteredBuildings: BuildingOption[] = [];
  filteredVehicles: VehicleOption[] = [];

  constructor(
    private fb: FormBuilder,
    private platformService: PlatformService,
    private buildingService: BuildingService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private authService: AuthStateService,
    private router: Router
  ) {
    this.platformForm = this.fb.group({
      platformName: ['', [Validators.required, Validators.minLength(3)]], // name yerine platformName
      description: [''],
      buildings: [[]],
      vehicles: [[]]
    });

  }

  async ngOnInit() {
    try {
      await this.getUserID();
      const rawVehicles = await this.vehicleService.listVehicles();

      console.log('Raw vehicles data:', rawVehicles);

      // API'den gelen veriyi VehicleOption interface'ine uygun hale getiriyoruz
      this.vehicleOptions = Array.isArray(rawVehicles)
        ? rawVehicles.map(vehicle => ({
          id: vehicle.id,
          name: vehicle.vehicleName || vehicle.name, // API'den gelen veriye göre ayarlayın
        }))
        : [];

      console.log('Processed vehicle options:', this.vehicleOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
      this.showErrorMessage('Seçenekler yüklenirken bir hata oluştu lütfen teknik destek talep edin.');
    }
  }

  async getUserID() {
    try {
      const attributes = await this.authService.getStoredAttributes();
      if (attributes && attributes.sub) {
        this.userID = attributes.sub;
      } else {
        console.error('User attributes or sub not found');
      }
    } catch (error) {
      console.error('Error getting stored attributes:', error);
    }
  }

  async onSubmit() {
    if (this.platformForm.valid) {
      try {
        console.log('Form values:', this.platformForm.value);
        console.log('Selected buildings:', this.selectedBuildings);
        console.log('Selected vehicles:', this.selectedVehicles);

        const newPlatform = await this.platformService.createPlatform({
          platformName: this.platformForm.value.platformName,
          description: this.platformForm.value.description,
          userID: this.userID,
          buildings: this.selectedBuildings.map(b => b.id),
          vehicles: this.selectedVehicles.map(v => v.id)
        });

        console.log('New platform created:', newPlatform);
        this.showSuccessMessage('Yeni platform başarıyla eklendi, yönlendiriliyorsunuz...');
        this.platformForm.reset();
        setTimeout(() => {
          this.router.navigate(['/platformlarim']);
        })
      } catch (error) {
        console.error('Error creating platform:', error);
        this.showErrorMessage(this.getErrorMessage(error));
      }
    } else {
      // Form doğrulama hataları
    }
  }


  showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: message,
      life: 3000
    });
  }

  showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Hata',
      detail: message,
      life: 3000
    });
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'Bilinmeyen hata';
    }
  }

  filterBuildings(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.filteredBuildings = this.buildingOptions && Array.isArray(this.buildingOptions)
      ? this.buildingOptions.filter(building =>
        building.name.toLowerCase().includes(query)
      )
      : [];
  }

  filterVehicles(event: { query: string }) {
    const query = event.query.toLowerCase();
    console.log('Vehicle options:', this.vehicleOptions);

    this.filteredVehicles = this.vehicleOptions && Array.isArray(this.vehicleOptions)
      ? this.vehicleOptions.filter(vehicle =>
        vehicle && vehicle.name && // null check
        vehicle.name.toLowerCase().includes(query)
      )
      : [];

    console.log('Filtered vehicles:', this.filteredVehicles);
  }

  onBuildingSelect(event: AutoCompleteSelectEvent) {
    const building = event.value as BuildingOption;
    if (!this.selectedBuildings.some(b => b.id === building.id)) {
      this.selectedBuildings.push(building);
      console.log('Selected buildings updated:', this.selectedBuildings);
    }
  }

  onVehicleSelect(event: AutoCompleteSelectEvent) {
    const vehicle = event.value as VehicleOption;
    if (!this.selectedVehicles.some(v => v.id === vehicle.id)) {
      this.selectedVehicles.push(vehicle);
      console.log('Selected vehicles updated:', this.selectedVehicles);
    }
  }

  removeBuilding(building: BuildingOption) {
    this.selectedBuildings = this.selectedBuildings.filter(b => b.id !== building.id);
    console.log('Building removed, updated list:', this.selectedBuildings);
  }

  removeVehicle(vehicle: VehicleOption) {
    this.selectedVehicles = this.selectedVehicles.filter(v => v.id !== vehicle.id);
    console.log('Vehicle removed, updated list:', this.selectedVehicles);
  }
}