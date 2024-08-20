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
import { MultiSelectModule } from 'primeng/multiselect';

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
    MultiSelectModule
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
      description: ['', [Validators.required, Validators.minLength(3)]],
      buildings: [[]],
      vehicles: [[]]
    });

  }

  async ngOnInit() {

    try {

      await this.getUserID();
      this.buildingOptions = await this.buildingService.listBuildings();
      this.vehicleOptions = await this.vehicleService.listVehicles();
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
        console.log('User ID:', this.userID);
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
        const newPlatform = await this.platformService.createPlatform({
          ...this.platformForm.value,
          userID: this.userID
        });
        console.log('New platform created:', newPlatform);
        this.showSuccessMessage('Yeni platform başarıyla eklendi, yönlendiriliyorsunuz...');
        this.platformForm.reset();
        setTimeout(() => {
          this.router.navigate(['/platformlarim']);
        }, 2500);
      } catch (error) {
        console.error('Error creating platform:', error);
        this.showErrorMessage(this.getErrorMessage(error));
      }
    } else {
      Object.keys(this.platformForm.controls).forEach(key => {
        const control = this.platformForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
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
}