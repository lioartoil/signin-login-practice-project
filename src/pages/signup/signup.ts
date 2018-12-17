import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  IonicPage,
  LoadingController,
  AlertController,
  NavParams,
  NavController
} from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';

import { AuthService } from '../../services/auth';
import { Profile } from '../../model/profile';
import { ChangePasswordPage } from '../change-password/change-password';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signupForm: FormGroup;
  profile: Profile;
  user: firebase.User;
  edit = false;
  saved = false;
  title = 'Signup';
  button = 'Sign up';
  changePassword = false;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private navCtrl: NavController
  ) {
    this.initForm();
  }

  initForm() {
    if (this.navParams.get('edit')) {
      this.edit = true;
      this.title = 'Update Profile';
      this.button = 'Save';
      this.user = this.authService.user;
      this.profile = this.authService.profile;
      let birthday = moment
        .unix(this.profile.birthday.seconds)
        .format('YYYY-MM-DD');

      this.signupForm = new FormGroup({
        firstName: new FormControl(this.profile.firstName, [
          Validators.required
        ]),
        lastName: new FormControl(this.profile.lastName),
        birthday: new FormControl(birthday),
        gender: new FormControl(this.profile.gender)
      });

      this.authService.getProfile().then((data: Profile) => {
        this.authService.setProfile(data);
        this.profile = data;
        birthday = moment.unix(data.birthday.seconds).format('YYYY-MM-DD');

        this.signupForm.setValue({
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          birthday: birthday,
          gender: this.profile.gender
        });
      });
    } else {
      let email = '';
      if (this.navParams.get('email')) {
        email = this.navParams.get('email');
      }

      this.signupForm = new FormGroup(
        {
          email: new FormControl(email, [
            Validators.required,
            Validators.email
          ]),
          firstName: new FormControl(email, [Validators.required]),
          lastName: new FormControl(''),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
          ]),
          confirmPassword: new FormControl(''),
          birthday: new FormControl('2005-01-01'),
          gender: new FormControl('male')
        },
        { validators: this.chkPassword('password', 'confirmPassword') }
      );
    }
  }

  ionViewCanLeave() {
    if (!this.saved && this.signupForm.touched && !this.changePassword) {
      return new Promise((resolve, reject) => {
        let confirm = this.alertCtrl.create({
          title: 'Discard changes?',
          message:
            'Press OK to continue or Cancel to stay on the current page.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                resolve();
              }
            },
            {
              text: 'Cancel',
              handler: () => {
                reject();
              }
            }
          ]
        });
        confirm.present();
      });
    }
  }

  chkPassword(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      let isValid = password.value == confirmPassword.value;
      if (!isValid) {
        return { equalTo: { isValid } };
      } else {
        return null;
      }
    };
  }

  onSignup() {
    this.saved = true;

    const email = this.signupForm.value.email
      ? this.signupForm.value.email
      : this.profile.email;
    const { password } = this.signupForm.value;
    const { firstName } = this.signupForm.value;
    const { lastName } = this.signupForm.value;
    const birthday = new Date(this.signupForm.value.birthday);
    const { gender } = this.signupForm.value;
    const photoURL = 'http://via.placeholder.com/165x230';
    // this.signupForm.value.photoUrl;

    const newProfile = new Profile(
      email,
      firstName,
      lastName,
      photoURL,
      birthday,
      gender
    );

    const loading = this.loadingCtrl.create({
      content: this.edit ? 'Updating' : 'Signing you up...'
    });
    loading.present();

    if (this.edit) {
      this.authService
        .updateUser(this.user, newProfile)
        .then(() => {
          this.authService
            .getProfile()
            .then((data: Profile) => this.authService.setProfile(data));
          loading.dismiss();
          this.signupForm.markAsPristine();
          this.showPopup('Success!', 'Your profile updated');
        })
        .catch(err => {
          this.saved = false;
          loading.dismiss();
          this.signupForm.markAsPristine();
          this.showPopup('Update failed!', err.message);
        });
    } else {
      this.authService
        .signup(email, password)
        .then(data => this.authService.addNewUser(data.user, newProfile))
        .then(() => {
          this.authService
            .getProfile()
            .then((data: Profile) => this.authService.setProfile(data));
          loading.dismiss();
          this.showPopup('Success!', 'Your account created');
        })
        .catch(err => {
          this.saved = false;
          loading.dismiss();
          this.signupForm.markAsPristine();
          this.showPopup('Signup failed!', err.message);
        });
    }
  }

  onChangePassword() {
    this.changePassword = true;
    this.navCtrl
      .push(ChangePasswordPage)
      .then(() => (this.changePassword = false));
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
