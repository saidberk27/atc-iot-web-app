import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-first-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
  templateUrl: './first-sign-in.component.html',
  styles: []
})
export class FirstSignInComponent implements OnInit, OnDestroy {
  verificationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  username: string = '';
  private emailSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.emailSubscription = new Subscription();
  }

  ngOnInit() {
    this.emailSubscription = this.authStateService.tempEmail$.subscribe(
      email => {
        if (email) {
          this.username = email;
        } else {
          console.error('E-posta adresi bulunamadı.');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if (this.verificationForm.valid) {
      try {
        const code = this.verificationForm.get('verificationCode')?.value;

        const { isSignUpComplete } = await confirmSignUp({
          username: this.username,
          confirmationCode: code
        });

        if (isSignUpComplete) {
          this.successMessage = 'Hesabınız başarıyla doğrulandı!';
          this.errorMessage = '';
          this.authStateService.clearTempEmail(); // Geçici email'i temizle
          // Kullanıcıyı ana sayfaya yönlendir
          setTimeout(() => this.router.navigate(['/home']), 2000);
        } else {
          this.errorMessage = 'Doğrulama tamamlanamadı. Lütfen tekrar deneyin.';
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Doğrulama başarısız oldu. Lütfen kodu kontrol edip tekrar deneyin.';
        this.successMessage = '';
        console.error('Doğrulama hatası:', error);
      }
    }
  }

  async resendCode() {
    try {
      await resendSignUpCode({ username: this.username });
      this.successMessage = 'Yeni doğrulama kodu gönderildi.';
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Kod gönderme başarısız oldu. Lütfen daha sonra tekrar deneyin.';
      this.successMessage = '';
      console.error('Kod gönderme hatası:', error);
    }
  }
}