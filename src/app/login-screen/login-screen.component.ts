import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { signIn, getCurrentUser, confirmSignIn } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    MessageModule
  ],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.emailValidator]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    rememberMe: [false],
    mfaCode: ['']
  });

  errorMessage: string = '';
  successMessage: string = '';
  showMfaInput: boolean = false;
  private signInData: any;

  constructor(private fb: FormBuilder, private router: Router, private authStateService: AuthStateService) { }

  async ngOnInit() {
    try {
      const user = await getCurrentUser();
      console.log('Kullanıcı giriş yapmış:', user);
      this.successMessage = 'Hoş geldiniz!';
      this.authStateService.setSignInData(user);
      setTimeout(() => {
        this.router.navigate(['/ana-sayfa']);
      }, 1000);
    } catch (error) {
      console.log('Kullanıcı giriş yapmamış');
      // Oturum açık değilse tüm yerel depolama verilerini temizle
      this.authStateService.clearSignInData();
      this.authStateService.clearTempEmail();
      localStorage.clear();
    }
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (email && !email.includes('@')) {
      return { invalidEmail: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (password && password.length < 8) {
      return { shortPassword: true };
    }
    return null;
  }

  async onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      if (email && password) {
        try {
          const { isSignedIn, nextStep } = await signIn({
            username: email,
            password: password
          });

          if (isSignedIn) {
            const user = await getCurrentUser();
            this.authStateService.setSignInData(user);
            this.successMessage = 'Giriş başarılı!';
            console.log('Giriş başarılı');
            this.router.navigate(['/ana-sayfa']);
          } else {
            console.log('Ek adımlar gerekli');
            if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
              this.authStateService.setSignInData(nextStep);
              this.router.navigate(['/sifre-degistir']);
            }

            else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
              this.authStateService.setTempEmail(email);
              this.router.navigate(['/ilk-kayit']);
            }

            else {
              this.errorMessage = 'Beklenmeyen ek doğrulama adımı gerekli: ' + nextStep.signInStep;
            }
          }
        } catch (error: any) {
          console.error('Giriş hatası', error);
          if (error.name === 'UserNotFoundException') {
            this.errorMessage = 'Kullanıcı bulunamadı.';
          } else if (error.name === 'NotAuthorizedException') {
            this.errorMessage = 'Yanlış e-posta veya şifre.';
          } else {
            this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
          }
        }
      }
    } else {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.errorMessage = 'E-posta adresi gereklidir.';
      } else if (this.loginForm.get('email')?.hasError('email') || this.loginForm.get('email')?.hasError('invalidEmail')) {
        this.errorMessage = 'Geçerli bir e-posta adresi giriniz.';
      } else if (this.loginForm.get('password')?.hasError('required')) {
        this.errorMessage = 'Şifre gereklidir.';
      } else if (this.loginForm.get('password')?.hasError('minlength') || this.loginForm.get('password')?.hasError('shortPassword')) {
        this.errorMessage = 'Şifre en az 8 karakter olmalıdır.';
      }
    }
  }

  async confirmMfa() {
    const mfaCode = this.loginForm.get('mfaCode')?.value;
    if (mfaCode) {
      try {
        const { isSignedIn } = await confirmSignIn({ challengeResponse: mfaCode });
        if (isSignedIn) {
          const user = await getCurrentUser();
          this.authStateService.setSignInData(user);
          this.successMessage = 'MFA doğrulaması başarılı! Giriş yapılıyor...';
          this.router.navigate(['/ana-sayfa']);
        } else {
          this.errorMessage = 'MFA doğrulaması başarısız oldu. Lütfen tekrar deneyin.';
        }
      } catch (error) {
        console.error('MFA doğrulama hatası', error);
        this.errorMessage = 'MFA doğrulaması sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      }
    } else {
      this.errorMessage = 'Lütfen MFA kodunu girin.';
    }
  }

  async forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      try {
        // resetPassword fonksiyonunu import etmeniz gerekiyor
        // import { resetPassword } from 'aws-amplify/auth';
        // await resetPassword({ username: email });
        console.log('Şifre sıfırlama başlatıldı');
        this.successMessage = 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.';
      } catch (error) {
        console.error('Şifre sıfırlama hatası', error);
        this.errorMessage = 'Şifre sıfırlama işlemi başlatılırken bir hata oluştu.';
      }
    } else {
      this.errorMessage = 'Lütfen şifre sıfırlama için e-posta adresinizi girin.';
    }
  }
}