import React, { Component } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { connect } from 'react-redux';
import { loginRequest, logoutRequest, loginFailRequest } from '../redux/authReducer';
import { AuthProvider } from '../firebase/AuthManager';
import storage from '../lib/storage';
import styles from './Login.css';
import className from 'classnames/bind';
const cx = className.bind(styles);

const MAX_NAME = 15;
const isEmpty = (str)=>{
  if(!str) return true;

  if(str && str.trim().length <= 0) {
    return true;
  }

  return false;
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterRoom = this.handleEnterRoom.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.focusInputName = this.focusInputName.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.focusInputName();
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  handleEnterRoom(event) {
    console.log(isEmpty(this.state.name));
    if(isEmpty(this.state.name)) {
      alert("Enter your name");
      console.log(this.inputName);
      this.focusInputName();
    } else {

      storage.set('userName', this.state.name);
      this.props.loginRequest(AuthProvider.ANONYM);
    }
  }

  handleKeyDown(event) {
    if(event.keyCode === 13) { // Enter key
      this.handleEnterRoom(event);
    }
  }

  handleLogout(event) {
    this.props.logoutRequest(AuthProvider.ANONYM);
    this.setState({name: ""});
  }

  focusInputName() {
    if(this.inputName) this.inputName.focus();
  }

  render() {
    const userName = this.props.authState.currentUser.displayName;

    let { buttonLabel, onClickButton } = this.props;
    if(!buttonLabel) {
      buttonLabel = "Chat";
    }

    const LoggedInView = (
      <div className={cx('mainContainer')}>
        <div className={cx('mainChild')} id={cx('userName')}>{userName}</div>
          <Button className={cx('mainChild', 'button')} onClick={onClickButton} >{buttonLabel}</Button>
          <Button className={cx('mainChild', 'button')} onClick={this.handleLogout} >Logout</Button>
      </div>
    );

    const LoggedOutView = (
      <div className={cx('mainContainer')}>
        <Input className={cx('mainChild')} id={cx('userName')}
          type="text"
          name="userName"
          placeholder={"이름/Nom/Name"}
          value={this.state.name}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          maxLength={MAX_NAME}
          innerRef={c=>{this.inputName = c;}}
        />
        <Button
          className={cx('mainChild', 'button')}
          onClick={this.handleEnterRoom}
        >
          Login
        </Button>
      </div>
    );

    return (this.props.authState.isLoggedIn ? LoggedInView : LoggedOutView);
  }
}

const mapStateToProps = state=>({
  authState: state.authState,
});

const mapDispatchToProps = dispatch=>({
  loginRequest: (signInProvider, userName) => dispatch(loginRequest(signInProvider)),
  logoutRequest: (signInProvider)=>dispatch(logoutRequest(signInProvider)),
  loginFailure: (signInProvider, error) => dispatch(loginFailRequest(signInProvider, error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);