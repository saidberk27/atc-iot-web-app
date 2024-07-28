import { Routes } from '@angular/router';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { AboutScreenComponent } from './about-screen/about-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ChangePasswordComponent } from './login-screen/change-password/change-password.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { authGuard } from './guards/auth-guard';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { AddUserComponent } from './add-user/add-user.component';
import { FirstSignInComponent } from './login-screen/first-sign-in/first-sign-in.component';


export const routes: Routes = [
    { path: '', component: LandingScreenComponent },
    { path: 'ana-sayfa', component: HomeScreenComponent, canActivate: [authGuard] },
    { path: 'hakkimizda', component: AboutScreenComponent },
    { path: 'giris-yap', component: LoginScreenComponent },
    { path: 'sifre-degistir', component: ChangePasswordComponent },
    { path: 'yonetim', component: AdminScreenComponent },
    { path: 'kullanici-ekle', component: AddUserComponent },
    { path: 'ilk-kayit', component: FirstSignInComponent },
    { path: '**', redirectTo: '' }
];