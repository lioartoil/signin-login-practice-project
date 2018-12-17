import { Component } from '@angular/core';

import {
  IonicPage,
  AlertController,
  NavController,
  LoadingController
} from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  onSendRequest(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Sending...'
    });

    loading.present();

    this.authService
      .forgotPassword(form.value.email)
      .then(() => {
        loading.dismiss();
        this.showPopup('Email sent!', 'Please check your email');
      })
      .catch(err => {
        loading.dismiss();
        this.showPopup('Failed!', err.message);
      });
  }

  showPopup(title, text) {
    const alert = this.alertCtrl.create({
      title: title,
      message: text,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (title == 'Email sent!') {
              this.navCtrl.pop();
            }
          }
        }
      ]
    });

    alert.present();
  }
}
