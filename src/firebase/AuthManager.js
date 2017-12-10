import firebase from 'firebase';
import FireApp from './FireApp';

const auth = FireApp.getAuth();

export const AuthProvider = {
  ANONYM: "Anonymously",
}

const AuthManager = {
  signIn: async (provider=AuthProvider.ANONYM) => {

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
      switch(provider) {
        case AuthProvider.ANONYM:
        default:
        {
          return signInAnonymously();
        }
        
      }
    });
  },
  signOut: async (provider=AuthProvider.ANONYM) => {
    switch(provider) {
      case AuthProvider.ANONYM:
      default:
      {
        auth.signOut();
        return;
      }
    }
  },
  getCurrentUser: ()=>auth.currentUser,
  updateProfile: (profile) => auth.currentUser.updateProfile(profile),
}

export default AuthManager;

const signInAnonymously = () => {
  if(!auth) return Promise.reject(new Error("Firebase Auth is null"));

  return auth.signInAnonymously();
}