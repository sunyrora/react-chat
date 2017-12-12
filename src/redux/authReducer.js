import { createActions, handleActions } from 'redux-actions';
import AuthManager from '../firebase/AuthManager';
import update from 'immutability-helper';
import storage from '../lib/storage';

const AUTH_STATUS_INIT = 'AUTH_STATUS_INIT';
const AUTH_STATUS_SUCCESS = 'AUTH_STATUS_SUCCESS';
const AUTH_STATUS_WAIT = 'AUTH_STATUS_WAIT';
const AUTH_STATUS_FAIL = "AUTH_STATUS_FAIL";

const LOGIN = 'LOGIN';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const LOGOUT = 'LOGOUT';

export const actions = createActions({
  [LOGIN]: {
    [LOGIN]: undefined,
    [SUCCESS]: undefined,
    [FAILURE]: undefined,
  },
  [LOGOUT]: {
    [LOGOUT]: undefined,
    [SUCCESS]: undefined,
    [FAILURE]: undefined,
  }
});

const errorInit = {
  code: 0,
  text: '',
};

const initialState = {
  status: AUTH_STATUS_INIT,
  isLoggedIn: false,
  currentUser: {},
  error: errorInit,
};

export const loginRequest = (signInProvider) => {
  return async (dispatch, getState) => {
    const { authState } = getState();
    if(authState.status === AUTH_STATUS_WAIT) return; // 중복 액션 방지

    try {
      dispatch(actions.login.login());
      
      await AuthManager.signIn(signInProvider);
      
    } catch (error) {
      console.log(error.stack);
      dispatch(loginFailRequest(signInProvider, error));
    }
  }
}

const login = (state=initialState, action) => {
  return update(state, {
    status: {$set: AUTH_STATUS_WAIT},
  });
};

export const loginSuccessRequest = () => {
  return (dispatch, getState) =>{
    const currentUser = AuthManager.getCurrentUser();
    if(currentUser) {
      const user = JSON.parse(JSON.stringify(currentUser));
      dispatch(actions.login.success(user));
    } else {
      dispatch(actions.login.failure(new Error("No user? C'est pas possible..")));
    }
  }
}

const loginSuccess = (state, action) => {
  return update(state, {
    currentUser: {$set: action.payload},
    isLoggedIn: {$set: true},
    status: {$set: AUTH_STATUS_SUCCESS},
  });
}

export const loginFailRequest = (provider, error) => {
  return (dispatch, getState) => {
    console.log(error.stack)
    dispatch(actions.login.failure(error));
    dispatch(logoutRequest(provider));
  }
}

const lgoinFailure = (state, action) => {
  return update(state, {
    currentUser: {$set: {}},
    isLoggedIn: {$set: false},
    status: {$set: AUTH_STATUS_FAIL},
    error: {$set: action.payload},
  });
}

export const logoutRequest = (signInProvider) => {
  return async (dispatch, getState) => {
    const { authState } = getState();
    if(authState.status === AUTH_STATUS_WAIT) return; // 중복 액션 방지 

    dispatch(actions.logout.logout());
    
    try {
      storage.remove('userName');

      if(signInProvider) {
        await AuthManager.signOut(signInProvider);
      }
            
      dispatch(actions.logout.success());
    } catch (error) {
      dispatch(actions.logout.failure(error))
    }
  }
}

const logoutSuccess = (state, action) => {
  return update(state, {
    currentUser: {$set: {}},
    isLoggedIn: {$set: false},
    status: {$set: AUTH_STATUS_SUCCESS},
    error: {$set: errorInit},
  });
}

const logout = (state, action) => {
  return update(state, {
    status: {$set: AUTH_STATUS_WAIT},
  })
}

const logoutFailure = (state, action) => {
  return update(state, {
    status: {$set: AUTH_STATUS_FAIL},
    error : {$set: action.payload},
  });
}

export default handleActions (
  {
    [LOGIN]: {
      [LOGIN]: login,
      [SUCCESS]: loginSuccess,
      [FAILURE]: lgoinFailure,
    },
    [LOGOUT]: {
      [LOGOUT]: logout,
      [SUCCESS]: logoutSuccess,
      [FAILURE]: logoutFailure,
    },
  },
  initialState
);