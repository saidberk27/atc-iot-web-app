import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-buildings',
  standalone: true,
  imports: [],
  templateUrl: './my-buildings.component.html',
  styleUrl: './my-buildings.component.css'
})
export class MyBuildingsComponent {

  constructor(private router: Router) { }
  readonly title = "Binalarım";
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}


