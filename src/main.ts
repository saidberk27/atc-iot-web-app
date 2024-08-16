import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { generateClient } from '@aws-amplify/api';
import { Schema } from '../amplify/data/resource';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideAnimations(),

  ]
}).catch(err => console.error(err));

const client = generateClient<Schema>()


client.queries.sayHello({
  name: "Amplify",
})