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
import { MyAccountScreenComponent } from './my-account-screen/my-account-screen.component';
import { MyPlatformsComponent } from './my-platforms/my-platforms.component';
import { MyVehiclesComponent } from './my-vehicles/my-vehicles.component';
import { MyBuildingsComponent } from './my-buildings/my-buildings.component';
import { AddNewVehicleComponent } from './my-vehicles/add-new-vehicle/add-new-vehicle.component';
import { SensorScreenComponent } from './api-test-component/api-test-component.component';
import { ListPlatformsComponent } from './my-platforms/list-platforms/list-platforms.component';
import { AddNewPlatformComponent } from './my-platforms/add-platform/add-platform.component';
import { AddNewBuildingComponent } from './my-buildings/add-new-building/add-new-building.component';
import { PlatformBuildingComponent } from './my-platforms/list-platforms/platform-building/platform-building.component';
import { PlatformVehicleComponent } from './my-platforms/list-platforms/platform-vehicle/platform-vehicle.component';
import { LiveLocationComponent } from './my-platforms/list-platforms/platform-vehicle/sensor-screen/sensor-screen.component';


export const routes: Routes = [
    { path: '', component: LandingScreenComponent },
    { path: 'ana-sayfa', component: HomeScreenComponent, canActivate: [authGuard] },
    { path: 'hakkimizda', component: AboutScreenComponent },
    { path: 'giris-yap', component: LoginScreenComponent },
    { path: 'sifre-degistir', component: ChangePasswordComponent },
    {
        path: 'yonetim',
        component: AdminScreenComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['Admin'] }
    },
    {
        path: 'kullanici-ekle',
        component: AddUserComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['Admin'] }
    },
    { path: 'ilk-kayit', component: FirstSignInComponent },
    { path: 'hesabim', component: MyAccountScreenComponent },
    {
        path: 'platformlarim',
        component: MyPlatformsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'platformlari-listele',
        component: ListPlatformsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'yeni-platform-ekle',
        component: AddNewPlatformComponent,
        canActivate: [authGuard]
    },
    {
        path: 'platform-bina',
        component: PlatformBuildingComponent,
        canActivate: [authGuard]
    },
    {
        path: 'platform-arac/:platformID',
        component: PlatformVehicleComponent,
        canActivate: [authGuard]
    },
    {
        path: 'araclarim',
        component: MyVehiclesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'yeni-arac-ekle',
        component: AddNewVehicleComponent,
        canActivate: [authGuard]
    },
    {
        path: 'binalarim',
        component: MyBuildingsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'yeni-bina-ekle',
        component: AddNewBuildingComponent,
        canActivate: [authGuard]
    }, {
        path: 'araci-izle/:vehicleID',
        component: LiveLocationComponent,
        canActivate: [authGuard]
    },
    {
        path: 'api-test',
        component: SensorScreenComponent
    },
    { path: '**', redirectTo: '' }
];