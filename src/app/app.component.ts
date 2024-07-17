import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { HomeScreenComponent } from "./home-screen/home-screen.component";

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, RouterLink, HomeScreenComponent],
})
export class AppComponent {
  title = 'amplify-angular-template';
}
