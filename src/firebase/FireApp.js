import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
/*
  firebaseConfig: object from firebase console:
  {
    apiKey: ,
    authDomain:,
    databaseURL: ,
    projectId: ,
    storageBucket: ,
    messagingSenderId:
  };
 */

class FireApp {
  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig);
  }

  getApp() {
    return this.firebaseApp;
  }

  getAuth() {
    return firebase.auth();
  }
}

export default new FireApp();