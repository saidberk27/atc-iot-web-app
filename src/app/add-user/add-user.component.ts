import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service.service';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';



@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    DropdownModule,

  ],
  providers: [MessageService],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  errorMessages: string[] = [];
  roleOptions = [
    { label: 'Yönetici', value: 'Admin' },
    { label: 'Editör', value: 'Editor' },
    { label: 'Kullanıcı', value: 'User' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      organization: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.uppercaseValidator,
        this.specialCharValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.userForm.valueChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { noUppercase: true };
  }

  specialCharValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSpecialChar ? null : { noSpecialChar: true };
  }

  updateErrorMessages() {
    const password = this.userForm.get('password');
    const confirmPassword = this.userForm.get('confirmPassword');

    this.errorMessages = [];

    if (password && confirmPassword) {
      if (password.hasError('required') || confirmPassword.hasError('required')) {
        this.errorMessages.push('Şifre alanları zorunludur.');
      }
      if (password.hasError('minlength')) {
        this.errorMessages.push('Şifre en az 8 karakter olmalıdır.');
      }
      if (password.hasError('noUppercase')) {
        this.errorMessages.push('Şifre en az bir büyük harf içermelidir.');
      }
      if (password.hasError('noSpecialChar')) {
        this.errorMessages.push('Şifre en az bir özel karakter içermelidir.');
      }
      if (this.userForm.hasError('passwordMismatch')) {
        this.errorMessages.push('Şifreler eşleşmiyor.');
      }
    }
  }

  async onSubmit() {
    if (this.userForm.valid) {

      try {
        const response = await this.userService.createUser(this.userForm.value);
        console.log('User created successfully', response);
        this.showSuccessMessage('Üye ekleme başarılı');
        setTimeout(() => this.router.navigate(['/yonetim']), 1000);
      } catch (error) {
        console.error('Error creating user', error);
        this.showErrorMessage(this.getErrorMessage(error));
      }
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