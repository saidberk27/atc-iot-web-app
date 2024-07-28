import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-bottom-hero-section',
  standalone: true,
  imports: [CardModule, Button, TooltipModule],
  templateUrl: './bottom-hero-section.component.html',
  styleUrl: './bottom-hero-section.component.css'
})
export class BottomHeroSectionComponent {

}
