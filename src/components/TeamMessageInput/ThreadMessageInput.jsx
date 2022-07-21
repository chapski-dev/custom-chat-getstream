import React, { useCallback } from 'react';
import { ChatAutoComplete, EmojiPicker, useMessageInputContext } from 'stream-chat-react';

import './ThreadMessageInput.css';


import {
  SendButton,
  SmileyFace,
} from '../../assets';

export const ThreadMessageInput = (props) => {

  const messageInput = useMessageInputContext();

  const onChange = useCallback(
    (event) => {
      messageInput.handleChange(event);
    },
    [messageInput],
  );


  return (
    <div className='thread-message-input__wrapper'>
      <div className='thread-message-input__input'>
        <ChatAutoComplete
          onChange={onChange}
          rows={1}
          placeholder='Reply'
        />
        <div className='thread-message-input__icons'>
          <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
        </div>
        <div
          className='thread-message-input__button'
          role='button'
          aria-roledescription='button'
          onClick={messageInput.handleSubmit}
        >
          <SendButton />
        </div>
      </div>
      <EmojiPicker />
    </div>
  );
};
