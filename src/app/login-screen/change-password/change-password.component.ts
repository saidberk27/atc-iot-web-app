import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { confirmSignIn } from 'aws-amplify/auth';
import { AuthStateService } from '../../services/auth-state.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { getCurrentUser } from 'aws-amplify/auth'
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

        if (isSignedIn || nextStep.signInStep === 'DONE') {
          try {
            const user = await getCurrentUser();

            const userData = {
              username: user.username,
              userId: user.userId,
              signInDetails: {
                loginId: user.signInDetails?.loginId
              }
            };

            await this.authStateService.setSignInData(userData);
            console.log('Şifre değiştirildi ve oturum kaydedildi');
            this.successMessage = 'Şifreniz başarıyla değiştirildi. Yönlendiriliyorsunuz...';

            // Oturum kaydedildikten sonra yönlendirme yap
            setTimeout(() => this.router.navigate(['/ana-sayfa']), 2000);
          } catch (error) {
            console.error('Oturum kaydetme hatası', error);
            this.errorMessage = 'Oturum kaydedilirken bir hata oluştu. Lütfen tekrar giriş yapın.';
          }
        } else {
          this.errorMessage = 'Beklenmeyen bir durum oluştu. Lütfen tekrar deneyin.';
        }


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