import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BottomHeroSectionComponent } from "./bottom-hero-section/bottom-hero-section.component";
import { BottomHeroSection2Component } from './bottom-hero-section-2/bottom-hero-section-2.component';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, BottomHeroSectionComponent, BottomHeroSection2Component],
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss']
})
export class AboutScreenComponent implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private isMobile: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkIfMobile();
    this.setupScrollAnimation();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768; // Adjust this breakpoint as needed
  }

  setupScrollAnimation() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.isMobile ? 0.1 : 0.5 // Lower threshold for mobile
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