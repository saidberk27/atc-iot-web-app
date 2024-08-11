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
  userAttributes: any;
  fullName: string | null = null;
  userRole: string | null = "User";
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const storedAttributes = this.authStateService.getStoredAttributes();

      if (storedAttributes) {
        this.setUserAttributes(storedAttributes);
      } else {
        this.authStateService.userAttributes$.subscribe(async fetchedAttributes => {
          if (fetchedAttributes) {
            this.setUserAttributes(fetchedAttributes);
          }
        });

        await this.authStateService.fetchAndStoreUserAttributes();
      }
    } catch (error) {
      console.error('Error initializing home component:', error);
    }
  }

  private setUserAttributes(attributes: any) {
    this.userAttributes = attributes;
    this.fullName = `${attributes['custom:firstName']} ${attributes['custom:lastName']}`;
    this.userRole = attributes['custom:role'];
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