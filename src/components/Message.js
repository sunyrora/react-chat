import React from 'react';
import styles from './Message.css';
import className from 'classnames/bind';
const cx = className.bind(styles);

const Message = ({userName, createdAt, text}) => {
  const date = new Date(createdAt);
  return (
    <div className={cx('mainContainer')}>
      <div className={cx('userName')}>{userName}</div>
      <div className={cx('textContainer')}>
        <div className={cx('text')}>
          {text}
        </div>
        <div className={cx('createdAt')}>{date.toLocaleString()}</div>  
      </div>
    </div>
  );
};

export default Message;