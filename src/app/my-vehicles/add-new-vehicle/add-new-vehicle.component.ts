import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

import { VehicleService } from '../../services/vehicle.service';
import { MessageService } from 'primeng/api';
import { PlatformService } from '../../services/platform-service';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';

interface PlatformOption {
  id: string;
  description: string;
}

@Component({
  selector: 'app-add-new-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './add-new-vehicle.component.html',
  styleUrl: './add-new-vehicle.component.css'
})
export class AddNewVehicleComponent {
  private userID: string = '';
  vehicleForm: FormGroup;
  platformOptions: PlatformOption[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private platformService: PlatformService,
    private messageService: MessageService,

    private authService: AuthStateService,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(3)]],
      vehiclePlateNumber: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,4}))$/)]],
      vehicleDescription: [''],
      platformID: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      await this.getUserID();
      this.platformOptions = await this.platformService.listPlatforms(this.userID);

    } catch (error) {
      console.error('Error fetching platforms:', error);
      // Burada bir hata mesajı gösterilebilir
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
    if (this.vehicleForm.valid) {
      try {
        // Form değerlerini al ve userID'yi ekle
        const vehicleData = {
          ...this.vehicleForm.value,
          userID: this.userID
        };

        const newVehicle = await this.vehicleService.createVehicle(vehicleData);
        console.log('New vehicle created:', newVehicle);
        this.showSuccessMessage('Yeni araç başarıyla eklendi, yönlendiriliyorsunuz...');
        this.vehicleForm.reset();
        setTimeout(() => {
          this.router.navigate(['/araclarim']);
        }, 2500);
      } catch (error) {
        console.error('Error creating vehicle:', error);
        this.showErrorMessage(this.getErrorMessage(error));
      }
    } else {
      Object.keys(this.vehicleForm.controls).forEach(key => {
        const control = this.vehicleForm.get(key);
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