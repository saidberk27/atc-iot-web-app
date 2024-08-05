import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-platforms',
  standalone: true,
  imports: [],
  templateUrl: './my-platforms.component.html',
  styleUrl: './my-platforms.component.css'
})
export class MyPlatformsComponent {
  readonly title = "Platformlarım";
  constructor(private router: Router) {
  }
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}
