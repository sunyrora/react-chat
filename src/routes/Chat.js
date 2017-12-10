import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import DBManager from '../firebase/DBManager';
import update from 'immutability-helper';
import Login from '../containers/Login';
import { logoutRequest } from '../redux/authReducer';
import { AuthProvider } from '../firebase/AuthManager';
import Message from '../components/Message';
import MessageInput from '../containers/MessageInput';
import storage from '../lib/storage';

import styles from './Chat.css';
import className from 'classnames/bind';
const cx = className.bind(styles);

const theme = {
  main: '#8f3d88',
  background: 'rgba(255, 255, 255, 0.7)',
  margin: '5px',
  padding: '5px',
  height: '70%',
  alignSelf: 'center',
};

class Chat extends Component {
  constructor(props) {
    super(props);

    if(!storage.get('userName')) {
      this.props.history.push('/');
    }

    this.state = {
      messages: [],
    }

    this.handleChatMessages = this.handleChatMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    DBManager.setChatMessagesHandler(this.handleChatMessages);
  }

  componentDidUpdate() {
    if(this.MessagesList) {
      this.MessagesList.scrollTop = this.MessagesList.scrollHeight;
    }
  }

  componentWillUnmount() {
    try {
      DBManager.removeChatMessageHandler(); 
    } catch (error) {
      console.log(error.stack);
    }
  }

  handleChatMessages(snap) {
    /**
     * id: {messageId}
     * message - createdAt
     *           text
     *           userId
     *           userName
     */
    const message = snap.val();
    this.setState(update(this.state, {messages: {$push: [message]}}));

  }

  sendMessage(message) {
    try {
      DBManager.sendMessage(message);      
    } catch (error) {
      console.log(error.stack);
    }
  }

  handleLogout(event) {
    this.props.logoutRequest(AuthProvider.ANONYM);
  }

  render() {
    let messages = null;
    if(this.state.messages) {
      messages = this.state.messages.map((message, i)=>{
        return (
          <Message 
            key={message.id}
            userName={message.message.userName}
            createdAt={message.message.createdAt}
            text={message.message.text}
          />
        );
      });
    }

    return (
      <div className={cx('mainContainer')}>
        {
            !storage.get('userName') && <Redirect to="/" />
        }        
        <div className={cx('mainChild', 'messageList')} ref={c=>{this.MessagesList = c}}>
          {messages}
        </div>
        <div className={cx('mainChild', 'footer')}>
          <div id={cx('messageInput')}>
            <MessageInput sendMessage={this.sendMessage}/>
          </div>
          <div id={cx('loginBox')}>
            <Login
              onClickButton={()=>{this.props.history.push('/')}}
              ref={(c) => { this.loginComponent = c; }}
              buttonLabel="Home"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authState: state.authState,
});

const mapDispatchToProps = dispatch=>({
  logoutRequest: (signInProvider)=>dispatch(logoutRequest(signInProvider)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Chat);