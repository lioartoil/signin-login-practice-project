import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AuthService } from '../services/auth';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { TabsPage } from '../pages/tabs/tabs';
import { ChangePasswordPage } from '../pages/change-password/change-password';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    ChangePasswordPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    ChangePasswordPage
  ],
  providers: [
    StatusBar,
    AuthService,
    SplashScreen,
    // Camera,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
