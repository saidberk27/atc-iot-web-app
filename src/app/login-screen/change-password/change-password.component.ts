import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { confirmSignIn } from 'aws-amplify/auth';
import { AuthStateService } from '../../services/auth-state.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule
  ],
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authStateService: AuthStateService) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() { }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit() {
    if (this.changePasswordForm.valid) {
      try {
        const signInData = this.authStateService.getSignInData();
        const { isSignedIn, nextStep } = await confirmSignIn({
          challengeResponse: this.changePasswordForm.get('newPassword')?.value,
          options: {
            clientMetadata: signInData.clientMetadata
          }
        });

        if (isSignedIn) {
          this.successMessage = 'Şifreniz başarıyla değiştirildi. Yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/ana-sayfa']), 2000);
        } else if (nextStep.signInStep === 'DONE') {
          this.successMessage = 'Şifreniz başarıyla değiştirildi. Yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/ana-sayfa']), 2000);
        } else {
          this.errorMessage = 'Beklenmeyen bir durum oluştu. Lütfen tekrar deneyin.';
        }
        this.authStateService.clearSignInData();
      } catch (error: any) {
        console.error('Şifre değiştirme hatası', error);
        if (error.name === 'InvalidPasswordException') {
          this.errorMessage = 'Geçersiz şifre: Şifreniz politikamıza uygun değil. Lütfen daha güçlü bir şifre seçin.';
        } else if (error.name === 'LimitExceededException') {
          this.errorMessage = 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyip tekrar deneyin.';
        } else {
          this.errorMessage = 'Şifre değiştirme sırasında bir hata oluştu. Lütfen tekrar deneyin.';
        }
      }
    }
  }
}