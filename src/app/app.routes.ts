import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { AboutScreenComponent } from './about-screen/about-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
export const routes: Routes = [
    { path: '', component: HomeScreenComponent },
    { path: 'hakkimizda', component: AboutScreenComponent },
    { path: 'giris-yap', component: LoginScreenComponent }
];
