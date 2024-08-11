import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [],
  templateUrl: './my-vehicles.component.html',
  styleUrl: './my-vehicles.component.css'
})
export class MyVehiclesComponent {
  readonly title = "Araçlarım";
  constructor(private router: Router) { }
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}
