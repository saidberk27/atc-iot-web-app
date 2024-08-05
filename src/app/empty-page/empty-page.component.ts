import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-page',
  standalone: true,
  imports: [],
  templateUrl: './empty-page.component.html',
  styleUrl: './empty-page.component.css'
})
export class EmptyPageComponent {
  readonly title = "Boş Sayfa";

  constructor(private router: Router) { }
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}
