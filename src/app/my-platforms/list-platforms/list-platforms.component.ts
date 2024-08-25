import { Component, OnInit, platformCore } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService } from '../../services/platform-service';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionModule, InputTextModule, ButtonModule, PanelModule, CardModule],
  templateUrl: './list-platforms.component.html',
  styleUrl: './list-platforms.component.css',

})
export class ListPlatformsComponent implements OnInit {
  private userID: string = '';
  platforms: any[] = [];
  filteredPlatforms: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(
    private platformService: PlatformService,
    private authService: AuthStateService,

    private router: Router
  ) { }

  async ngOnInit() {
    await this.getUserID();
    await this.loadPlatforms();
  }

  async getUserID() {
    try {
      const attributes = await this.authService.getStoredAttributes();
      if (attributes && attributes.sub) {
        this.userID = attributes.sub;
        console.log('User ID:', this.userID);
      } else {
        console.error('User attributes or sub not found');
      }
    } catch (error) {
      console.error('Error getting stored attributes:', error);
    }
  }

  async loadPlatforms() {
    try {
      if (this.userID) {
        this.platforms = await this.platformService.listPlatforms(this.userID);
        console.log('Platforms:', this.platforms);
        this.filteredPlatforms = [...this.platforms];
        this.loading = false;
      } else {
        console.error('User ID not set');
      }
    } catch (error) {
      console.error('Error loading platforms:', error);
      this.loading = false;

    }
  }

  searchPlatforms() {
    this.filteredPlatforms = this.platforms.filter(platform =>
      platform.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editPlatform(platform: any, event: Event) {
    event.stopPropagation();
    console.log('Platform düzenleniyor:', platform);
    // Düzenleme işlemleri burada yapılacak
  }

  deletePlatform(platform: any, event: Event) {
    event.stopPropagation();
    console.log('Platform siliniyor:', platform);
    // Silme işlemleri burada yapılacak
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateToBuildings(platform: any) {
    this.router.navigate(['/platform-bina', platform.id]);
  }

  navigateToVehicles(platform: any) {
    this.router.navigate(['/platform-arac', platform.id]);
  }
}