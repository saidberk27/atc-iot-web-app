import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent implements OnInit {
  userEmail: string | null = null;

  constructor(private authStateService: AuthStateService) { }

  async ngOnInit() {
    const signInData = this.authStateService.getSignInData();
    console.log('SignInData:', signInData);
    if (signInData && signInData.username) {
      this.userEmail = signInData.signInDetails?.loginId || signInData.username;
    } else {
      console.log('No valid sign-in data found');
      // Kullanıcıyı giriş sayfasına yönlendirebilirsiniz
      // this.router.navigate(['/login']);
    }
  }
}