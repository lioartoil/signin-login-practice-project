import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  IonicPage,
  ToastController,
  NavController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';

import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private keyboard: Keyboard
  ) {
    this.keyboard.hideFormAccessoryBar(false);
  }

  onCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      err => {
        // Handle error
      }
    );
  }

  onConfirm(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Updating...'
    });
    loading.present();

    this.authService
      .changePassword(form.value.currentPassword, form.value.newPassword)
      .then(() => {
        let toast = this.toastCtrl.create({
          message: 'Password updated!',
          duration: 1500
        });
        loading.dismiss();
        toast.present();
        this.navCtrl.pop();
      })
      .catch(err => {
        form.reset();
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: err.message,
          buttons: ['OK']
        });
        loading.dismiss();
        alert.present();
      });
  }

  onKeyboard() {
    this.keyboard.show();
  }
}
