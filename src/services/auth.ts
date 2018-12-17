import firebase from 'firebase';

import { Profile } from '../model/profile';

export class AuthService {
  user: firebase.User;
  profile: Profile;

  login(email: string, password: string, remember: boolean) {
    let persistence =
      remember === true
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.NONE;
    return firebase
      .auth()
      .setPersistence(persistence)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      });
  }

  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  addNewUser(user: firebase.User, profile: Profile) {
    return Promise.all([
      this.addNewUserToCollection(profile),
      this.updateProfile(user, profile),
      this.verifyEmail(user)
    ]);
  }

  forgotPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  getProfile() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.user.email)
      .get()
      .then(doc => doc.data());
  }

  setProfile(profile: Profile) {
    this.profile = profile;
    this.profile.lastName = this.profile.lastName ? this.profile.lastName : '';
    this.profile.birthday = this.profile.birthday
      ? this.profile.birthday
      : '2005-01-01';
    this.profile.gender = this.profile.gender ? this.profile.gender : 'male';
  }

  updateUser(user: firebase.User, profile: Profile) {
    return Promise.all([
      this.updateProfile(user, profile),
      this.updateProfileToCollection(profile)
    ]);
  }

  changePassword(currentPassword: string, newPassword: string) {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credentials).then(() => {
      return user.updatePassword(newPassword);
    });
  }

  logout() {
    return firebase.auth().signOut();
  }

  private addNewUserToCollection(profile: Profile) {
    return firebase
      .firestore()
      .collection('users')
      .doc(profile.email)
      .set({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        photoURL: profile.photoURL,
        birthday: profile.birthday,
        gender: profile.gender,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
  }

  private updateProfile(user: firebase.User, profile: Profile) {
    return user.updateProfile({
      displayName: profile.firstName,
      photoURL: profile.photoURL
    });
  }

  private updateProfileToCollection(profile: Profile) {
    return firebase
      .firestore()
      .collection('users')
      .doc(profile.email)
      .update({
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        gender: profile.gender
      });
  }

  private verifyEmail(user: firebase.User) {
    return user.sendEmailVerification();
  }
}
