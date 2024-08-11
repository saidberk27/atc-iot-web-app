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
import { SystemService } from '../../services/system.service';

interface SystemOption {
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
  vehicleForm: FormGroup;
  systemOptions: SystemOption[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private systemService: SystemService,
    private messageService: MessageService
  ) {
    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(3)]],
      vehiclePlateNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{1,10}$/)]],
      vehicleDescription: [''],
      systemID: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.systemOptions = await this.systemService.listSystems();

    } catch (error) {
      console.error('Error fetching systems:', error);
      // Burada bir hata mesajı gösterilebilir
    }
  }

  async onSubmit() {
    if (this.vehicleForm.valid) {
      try {
        const newVehicle = await this.vehicleService.createVehicle(this.vehicleForm.value);
        console.log('New vehicle created:', newVehicle);
        // Burada başarılı işlem mesajı gösterilebilir
        this.vehicleForm.reset();
      } catch (error) {
        console.error('Error creating vehicle:', error);
        // Burada hata mesajı gösterilebilir
      }
    } else {
      // Form geçersizse kullanıcıya bilgi ver
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