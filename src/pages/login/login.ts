import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  IonicPage,
  NavController,
  LoadingController,
  AlertController
} from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { AuthService } from '../../services/auth';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginFailed = false;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  onLogin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });
    loading.present();

    this.authService
      .login(form.value.email, form.value.password, form.value.remember)
      .then(() => {
        loading.dismiss();
      })
      .catch(err => {
        this.loginFailed = true;
        form.controls['password'].setValue('');
        loading.dismiss();
        this.showPopup('Login failed!', err.message);
      });
  }

  onSignup(form: NgForm) {
    let email: string;

    if (this.loginFailed) {
      email = form.value.email;
    }

    this.navCtrl.push(SignupPage, { email: email });
  }

  onForgetPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  showPopup(title, text) {
    const alert = this.alertCtrl.create({
      title: title,
      message: text,
      buttons: ['OK']
    });

    alert.present();
  }
}
