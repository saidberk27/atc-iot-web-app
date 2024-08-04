import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { routes } from './app.routes';
import outputs from '../../amplify_outputs.json';
import { provideAnimations } from '@angular/platform-browser/animations';


Amplify.configure(outputs);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations()]
};
