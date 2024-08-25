//TODO Unit ekleme kısmı eksik

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

import { BuildingService } from '../../services/building.service';
import { MessageService } from 'primeng/api';
import { PlatformService } from '../../services/platform-service';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';


interface PlatformOption {
  id: string;
  description: string;
}


@Component({
  selector: 'app-add-new-building',
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
  templateUrl: './add-new-building.component.html',
  styleUrl: './add-new-building.component.css'
})
export class AddNewBuildingComponent {
  private userID: string = '';
  buildingForm: FormGroup;
  platformOptions: PlatformOption[] = [];

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private platformService: PlatformService,
    private messageService: MessageService,

    private authService: AuthStateService,
    private router: Router
  ) {
    this.buildingForm = this.fb.group({
      buildingName: ['', [Validators.required, Validators.minLength(3)]],
      buildingAddress: ['', [Validators.required, Validators.minLength(8)]],
      buildingDescription: [''],
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
    if (this.buildingForm.valid) {
      try {
        // Form değerlerini al ve userID'yi ekle
        const buildingData = {
          ...this.buildingForm.value,
          userID: this.userID
        };

        const newBuilding = await this.buildingService.createBuilding(buildingData);
        console.log('New building created:', newBuilding);
        this.showSuccessMessage('Yeni bina başarıyla eklendi, yönlendiriliyorsunuz...');
        this.buildingForm.reset();
        setTimeout(() => {
          this.router.navigate(['/binalarım']);
        }, 2500);
      } catch (error) {
        console.error('Error creating building:', error);
        this.showErrorMessage(this.getErrorMessage(error));
      }
    } else {
      Object.keys(this.buildingForm.controls).forEach(key => {
        const control = this.buildingForm.get(key);
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
