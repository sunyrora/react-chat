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
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    DBManager.setChatMessagesHandler(this.handleChatMessages);
  }

  componentDidUpdate() {
    if(this.MessagesList) {
      this.MessagesList.addEventListener("scroll", this.handleScroll);
    }
  }

  componentWillUnmount() {
    try {
      DBManager.removeChatMessageHandler(); 
    } catch (error) {
      console.log(error.stack);
    }
  }

  async handleScroll() {
    try {
      if(this.MessagesList.scrollTop <= 0) {
        const loadedMessages = await DBManager.loadOldMessages(this.state.messages[0].message.createdAt);
        if(!loadedMessages) return;

        const loadedValues = Object.values(loadedMessages);
        const newMessages = update(this.state, {
          messages: {$unshift: loadedValues}
        });

        this.setState(({messages})=>({messages: newMessages.messages }));
      }
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

    // scroll to bottom
    if(this.MessagesList) {
      this.MessagesList.scrollTop = this.MessagesList.scrollHeight;
    }
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

  renderMessage(message) {
    if(!message) return null;
    
    return (
      <Message 
        key={message.id}
        userName={message.message.userName}
        createdAt={message.message.createdAt}
        text={message.message.text}
      />
    );
  }


  render() {
    let mapMessages = (data)=>{
      return data.map((message, i)=>{
        return (
          <Message 
            key={message.id}
            currUserId={this.props.authState.currentUser.uid}
            message={message.message}
          />
        );
      });
    };

    return (
      <div className={cx('mainContainer')}>
        {
            !storage.get('userName') && <Redirect to="/" />
        }
        
        <div className={cx('mainChild', 'messageList')} ref={c=>{this.MessagesList = c}}>
          {mapMessages(this.state.messages)}
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