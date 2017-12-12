import React from 'react';
import styles from './Message.css';
import className from 'classnames/bind';
const cx = className.bind(styles);

const Message = ({currUserId, message}) => {
  const date = new Date(message.createdAt);
  const messagePosition = (message.userId===currUserId) ? 'right' : 'left';
  return (
    <div className={cx('mainContainer', messagePosition)}>
      <div className={cx('userName', messagePosition)}>{message.userName}</div>
      <div className={cx('textContainer', messagePosition)}>
        <div className={cx('text')}>
          {message.text}
        </div>
        <div className={cx('createdAt')}>{date.toLocaleString()}</div>  
      </div>
    </div>
  );
};

export default Message;