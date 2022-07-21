import React, { useCallback, useState } from 'react';
import { ImageDropzone } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useChannelStateContext,
  useChatContext,
  useMessageInputContext,
} from 'stream-chat-react';

import './TeamMessageInput.css';

import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';


import {
  BoldIcon,
  SendButton,
  SmileyFace,
} from '../../assets';

export const TeamMessageInput = (props) => {
  const { pinsOpen } = props;


  const {
    acceptedFiles,
    channel,
    maxNumberOfFiles,
    multipleUploads,
    thread,
  } = useChannelStateContext();
  const { client } = useChatContext();

  const [boldState, setBoldState] = useState(false);
  const [codeState, setCodeState] = useState(false);
  const [italicState, setItalicState] = useState(false);
  const [strikeThroughState, setStrikeThroughState] = useState(false);

  const resetIconState = () => {
    setBoldState(false);
    setCodeState(false);
    setItalicState(false);
    setStrikeThroughState(false);
  };

  const getPlaceholder = () => {
    if (channel.type === 'team') {
      return `#${channel.data.name || channel.data.id || 'random'}`;
    }

    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
    );

    if (!members.length || members.length === 1) {
      return members[0]?.user.name || members[0]?.user.id || 'Johnny Blaze';
    }

    return 'the group';
  };

  const messageInput = useMessageInputContext();

  const onChange = useCallback(
    (e) => {
      const { value } = e.target;
      const deletePressed = e.nativeEvent?.inputType === 'deleteContentBackward';

      if (boldState) {
        if (deletePressed) {
          e.target.value = `${value.slice(0, value.length - 2)}**`;
        } else {
          e.target.value = `**${value.replace(/\**/g, '')}**`;
        }
      } else if (codeState) {
        if (deletePressed) {
          e.target.value = `${value.slice(0, value.length - 1)}\``;
        } else {
          e.target.value = `\`${value.replace(/`/g, '')}\``;
        }
      } else if (italicState) {
        if (deletePressed) {
          e.target.value = `${value.slice(0, value.length - 1)}*`;
        } else {
          e.target.value = `*${value.replace(/\*/g, '')}*`;
        }
      } else if (strikeThroughState) {
        if (deletePressed) {
          e.target.value = `${value.slice(0, value.length - 2)}~~`;
        } else {
          e.target.value = `~~${value.replace(/~~/g, '')}~~`;
        }
      }

      messageInput.handleChange(e);
    },
    [boldState, codeState, italicState, messageInput, strikeThroughState],
  );


  return (
    <div className={`team-message-input__wrapper ${(!!thread || pinsOpen) && 'thread-open'}`}>
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          (maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles) 
      }>
        <div className='team-message-input__input'>
          <div className='team-message-input__top'>
            <UploadsPreview />
            <ChatAutoComplete
              onChange={onChange}
              placeholder={`Message ${getPlaceholder()}`}
            />
            <div
              className='team-message-input__button'
              role='button'
              aria-roledescription='button'
              onClick={messageInput.handleSubmit}
            >
              <SendButton />
            </div>
          </div>
          <div className='team-message-input__bottom'>
            <div className='team-message-input__icons'>
              <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
              <div className='icon-divider'></div>
              <BoldIcon {...{ boldState, resetIconState, setBoldState }} />
            </div>
          </div>
        </div>
      </ImageDropzone>
      <TeamTypingIndicator type='input' />
      <EmojiPicker />
    </div>
  );
};
