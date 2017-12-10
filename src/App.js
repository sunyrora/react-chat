import React, { Component } from 'react';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  Home,
  Chat,
  NoMatch,
}from './routes/index.async';
import AuthManager from './firebase/AuthManager';
import { connect } from 'react-redux';
import { loginSuccessRequest, logoutRequest } from './redux/authReducer';
import storage from './lib/storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleAuthStateChanged = this.handleAuthStateChanged.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);  
  }

  handleAuthStateChanged(userSnap) {
    console.log("==== auth state chaged!! userSnap: ", userSnap);
    if(userSnap) {
      const userName = storage.get('userName');
      console.log("handleAuthStateChanged::storage userName: ", userName);
      if(userName) {
        AuthManager.updateProfile({displayName: userName})
        .then(()=>{
          // const user = JSON.parse(JSON.stringify(userSnap));
          this.props.loginSuccessRequest();
        }).catch(error=>{
            console.log(error.stack);
        });
      }
    } else {
      this.props.logoutRequest();
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/chat" component={Chat} />
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state=>({
  authState: state.authState,
});

const mapDispatchToProps = dispatch=>({
  loginSuccessRequest: (user) => dispatch(loginSuccessRequest(user)),
  logoutRequest: (signInProvider)=>dispatch(logoutRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
