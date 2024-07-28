import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-bottom-hero-section',
  standalone: true,
  imports: [CardModule, Button],
  templateUrl: './bottom-hero-section.component.html',
  styleUrl: './bottom-hero-section.component.css'
})
export class BottomHeroSectionComponent {

}
