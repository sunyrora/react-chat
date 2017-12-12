import React, { Component } from 'react';
import Login from '../containers/Login';
import styles from './Home.css';
import className from 'classnames/bind';
const cx = className.bind(styles);

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleEnterRoom = this.handleEnterRoom.bind(this);
  }

  componentDidMount() {
  }

  handleEnterRoom(event) {
    console.log("Enter Room!!!");
    this.props.history.push('/chat');
  }

  render() {
    return (
      <div className={cx('mainContainer')}>
        <div className={cx('mainChild', 'greetings')}>
          <div className={cx('greetingsChild')} id={cx('anNyoung')} >안녕하세요</div>
          <div className={cx('greetingsChild')} id={cx('bonjour')}>Bonjour</div>
          <div className={cx('greetingsChild')} id={cx('hello')}>Hello</div>
        </div>
        <div className={cx('mainChild', 'loginBox')}>
          <Login 
            onClickButton={()=>{this.props.history.push('/chat')}}
            ref={(c) => { this.loginComponent = c; }}
          />
        </div>
      </div>
    );
  };
}

export default Home;