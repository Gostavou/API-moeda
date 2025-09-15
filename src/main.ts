import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routes';

import { addIcons } from 'ionicons';
import { 
  swapHorizontal, 
  swapVertical, 
  arrowForward, 
  cashOutline, 
  checkmarkCircle 
} from 'ionicons/icons';

addIcons({
  'swap-horizontal': swapHorizontal,
  'swap-vertical': swapVertical,
  'arrow-forward': arrowForward,
  'cash-outline': cashOutline,
  'checkmark-circle': checkmarkCircle
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      IonicModule.forRoot({}),
      HttpClientModule,
      FormsModule
    ),
    provideRouter(routes)
  ]
});