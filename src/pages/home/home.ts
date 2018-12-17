import { Component } from '@angular/core';

import { ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  ionViewDidLoad() {
    if (this.authService.user.displayName) {
      this.toastCtrl
        .create({
          message: 'Welcome back! ' + this.authService.user.displayName,
          duration: 1500,
          position: 'buttom'
        })
        .present();
    }
  }
}
