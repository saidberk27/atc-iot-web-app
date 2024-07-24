import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { CardModule } from 'primeng/card';
import { signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}