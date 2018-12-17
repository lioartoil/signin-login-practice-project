import { AuthService } from './../services/auth';
import { Component, ViewChild } from '@angular/core';

import { Platform, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import firebase from 'firebase';

import { TabsPage } from './../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { Profile } from './../model/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  isAuthenticated = false;
  @ViewChild('nav') nav: Nav;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private authService: AuthService,
    private keyboard: Keyboard,
    private loadingCtrl: LoadingController
  ) {
    firebase.initializeApp({
      apiKey: 'AIzaSyBR5_aClRRnceTsaIGzWJXIWjkbDUj2-Vg',
      authDomain: 'project1-d3071.firebaseapp.com',
      databaseURL: 'https://project1-d3071.firebaseio.com',
      projectId: 'project1-d3071',
      storageBucket: 'project1-d3071.appspot.com',
      messagingSenderId: '843082948189'
    });
    firebase.firestore().settings({
      timestampsInSnapshots: true
    });

    const loading = this.loadingCtrl.create({ content: 'Loading...' });
    loading.present();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        loading.dismiss();
        this.isAuthenticated = true;
        this.authService.user = user;
        this.rootPage = TabsPage;
        this.authService
          .getProfile()
          .then((profile: Profile) => this.authService.setProfile(profile));
      } else {
        loading.dismiss();
        this.isAuthenticated = false;
        this.authService.user = null;
        this.authService.profile = null;
        this.rootPage = LoginPage;
        // this.rootPage = SignupPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.keyboard.hideFormAccessoryBar(false);
    });
  }

  onUpdateProfile() {
    this.nav.push(SignupPage, { edit: true });
  }

  onLogout() {
    this.authService.logout();
  }
}
