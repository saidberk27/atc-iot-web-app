import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { CardModule } from 'primeng/card';
import { signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {
  userEmail: string | null = null;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) { }

  ngOnInit() {
    const signInData = this.authStateService.getSignInData();
    if (signInData && signInData.username) {
      this.userEmail = signInData.signInDetails?.loginId || signInData.username;
    }
  }

  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }

  async logout() {
    try {
      await signOut();
      this.authStateService.clearSignInData();
      // Tüm yerel depolama verilerini temizle
      localStorage.clear();
      // Oturumu sonlandırdıktan sonra sayfayı yenile
      window.location.href = '/giris-yap';
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu', error);
    }
  }
}