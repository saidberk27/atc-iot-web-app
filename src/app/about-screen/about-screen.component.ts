import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BottomHeroSectionComponent } from "./bottom-hero-section/bottom-hero-section.component";

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, BottomHeroSectionComponent],
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss']
})
export class AboutScreenComponent implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor() { }

  ngOnInit(): void {
    this.setupScrollAnimation();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupScrollAnimation() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          this.setColorScheme(entry.target as HTMLElement);
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, options);

    const sections = document.querySelectorAll('.sequence-item');
    sections.forEach((section, index) => {

      this.observer!.observe(section);
      section.classList.add(`color-scheme-${(index % 3) + 1}`);

    });
  }

  setColorScheme(element: HTMLElement) {
    const colorSchemeClass = Array.from(element.classList).find(cls => cls.startsWith('color-scheme-'));
    if (colorSchemeClass) {
      document.body.className = colorSchemeClass;
    }
  }
}