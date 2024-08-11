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
import { VehicleService } from '../../services/vehicle.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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
  ],
  providers: [MessageService],
  templateUrl: './add-new-vehicle.component.html',
  styleUrl: './add-new-vehicle.component.css'
})
export class AddNewVehicleComponent {
  vehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private router: Router

  ) {
    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(3)]],
      vehiclePlateNumber: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,4}))$/)
      ]],
      vehicleDescription: [''],
      systemID: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.vehicleForm.valid) {
      try {
        const newVehicle = await this.vehicleService.createVehicle(this.vehicleForm.value);
        console.log('New vehicle created:', newVehicle);
        this.showSuccessMessage('Yeni Araç Başarıyla Oluşturuldu, Yönlendiriliyorsunuz...')
        setTimeout(() => this.router.navigate(['/araclarim']), 1000);
        this.vehicleForm.reset();
      } catch (error) {
        console.error('Error creating vehicle:', error);
        this.showErrorMessage(this.getErrorMessage(error));
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