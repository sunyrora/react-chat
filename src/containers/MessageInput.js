import React, { Component } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { ThemeProvider } from 'styled-components';
import styles from './MessageInput.css';
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

class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    if(this.inputMessage) this.inputMessage.focus();
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleKeyDown(event) {
    if(event.keyCode === 13) { // Enter key
      this.sendMessage();
    }
  }

  handleSendMessage(event) {
    this.sendMessage();
  }

  sendMessage() {
    this.props.sendMessage(this.state.message);
    this.setState({message: ""});
    if(this.inputMessage) this.inputMessage.focus();
    
  }

  render() {    
    return (
      <div className={cx('mainContainer')}>
        <Input className={cx('child')}
          type="text"
          name="message"
          placeholder="Type message"
          value={this.state.message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          innerRef={c=>{this.inputMessage=c}}
        />
        <ThemeProvider theme={theme}>
          <Button className={cx('child')} onClick={this.handleSendMessage}>Send</Button>
        </ThemeProvider>
    </div>
    );
  }
}

export default MessageInput;
