import { Routes } from '@angular/router';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { AboutScreenComponent } from './about-screen/about-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ChangePasswordComponent } from './login-screen/change-password/change-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
    { path: '', component: LandingScreenComponent },
    { path: 'ana-sayfa', component: HomeScreenComponent, canActivate: [authGuard] },
    { path: 'hakkimizda', component: AboutScreenComponent },
    { path: 'giris-yap', component: LoginScreenComponent },
    { path: 'sifre-degistir', component: ChangePasswordComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];