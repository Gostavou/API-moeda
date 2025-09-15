import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForward, cashOutline, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {
  
  constructor(private router: Router) { 
    addIcons({
      'arrow-forward': arrowForward,
      'cash-outline': cashOutline,
      'checkmark-circle': checkmarkCircle
    });
  }

  goToConverter() {
    this.router.navigate(['/converter']); 
  }
}