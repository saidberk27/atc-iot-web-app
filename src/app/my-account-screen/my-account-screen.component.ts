import { Component } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account-screen',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './my-account-screen.component.html',
  styleUrl: './my-account-screen.component.css'
})
export class MyAccountScreenComponent {

  userAttributes: any;
  profileImageUrl: string = 'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg';
  constructor(private authService: AuthStateService, private router: Router) { }

  async ngOnInit() {
    try {
      const storedAttributes = this.authService.getStoredAttributes();

      if (storedAttributes) {
        this.setUserAttributes(storedAttributes); // Try Local Storage First
      } else {
        this.authService.userAttributes$.subscribe(async fetchedAttributes => {
          if (fetchedAttributes) {
            this.setUserAttributes(fetchedAttributes); // Then go database
          }
        });

        await this.authService.fetchAndStoreUserAttributes();
      }
    } catch (error) {
      console.error('Error initializing home component:', error);
    }
  }

  private setUserAttributes(attributes: any) {
    this.userAttributes = attributes;

  }

  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}


