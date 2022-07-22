import React, { useRef } from 'react';
import {
  Attachment,
  Avatar,
  messageHasReactions,
  MessageOptions,
  MessageRepliesCountButton,
  MessageStatus,
  MessageText,
  MessageTimestamp,
  ReactionSelector,
  SimpleReactionsList,
  useMessageContext,
  MessageSimple,
  MessageDeleted,
  areMessageUIPropsEqual, 
  messageHasAttachments, 
  EditMessageForm,
  MessageInput,
  MML,
  Modal,
  ReactionsList,
  useComponentContext,
  MessageContextValue
} from 'stream-chat-react';
import Moment from 'moment-timezone';


export const CustomMessage = () => {
  const {
    additionalMessageInputProps,
    clearEditingState,
    editing,
    endOfGroup,
    firstOfGroup,
    groupedByUser,
    handleAction,
    handleOpenThread,
    handleRetry,
    highlighted,
    isMyMessage,
    isReactionEnabled,
    message,
    onUserClick,
    onUserHover,
    reactionSelectorRef,
    showDetailedReactions,
    threadList,
  } = useMessageContext();
  const hasAttachment = messageHasAttachments(message);
  const hasReactions = messageHasReactions(message);

  const messageClasses = isMyMessage()
    ? 'str-chat__message str-chat__message--me str-chat__message-simple str-chat__message-simple--me'
    : 'str-chat__message str-chat__message-simple';

  if (message.deleted_at || message.type === 'deleted') {
    return <MessageDeleted message={message} />;
  }
  const frmtDta= function(date){
    const timeZone = Moment(date).tz("America/Los_Angeles").isDST()? "PDT" : "PST";
    return Moment(date).tz("America/Los_Angeles").format("MMMM, DD YYYY HH:mm ")+ timeZone;
  }
   return (
    <>
      {editing && (
        <Modal onClose={clearEditingState} open={editing}>
          <MessageInput
            clearEditingState={clearEditingState}
            Input={EditMessageForm}
            message={message}
            {...additionalMessageInputProps}
          />
        </Modal>
      )}
      {
        <div
          className={`
						${messageClasses}
						str-chat__message--${message.type}
						str-chat__message--${message.status}
						${message.text ? 'str-chat__message--has-text' : 'has-no-text'}
						${hasAttachment ? 'str-chat__message--has-attachment' : ''}
            ${hasReactions && isReactionEnabled ? 'str-chat__message--with-reactions' : ''}
            ${highlighted ? 'str-chat__message--highlighted' : ''}
            ${message.pinned ? 'pinned-message' : ''}
            ${groupedByUser ? 'str-chat__virtual-message__wrapper--group' : ''}
            ${firstOfGroup ? 'str-chat__virtual-message__wrapper--first' : ''}
            ${endOfGroup ? 'str-chat__virtual-message__wrapper--end' : ''}
					`.trim()}
          key={message.id}
        >
          <MessageStatus />
          {message.user && (
            <Avatar
              image={message.user.image}
              name={message.user.name || message.user.id}
              onClick={onUserClick}
              onMouseOver={onUserHover}
              user={message.user}
            />
          )}
          <div
            className='str-chat__message-inner'
            data-testid='message-inner'
            onClick={
              message.status === 'failed' && message.errorStatusCode !== 403
                ? () => handleRetry(message)
                : undefined
            }
            onKeyPress={
              message.status === 'failed' && message.errorStatusCode !== 403
                ? () => handleRetry(message)
                : undefined
            }
          >
            <>
              <MessageOptions />
              {hasReactions && !showDetailedReactions && isReactionEnabled && (
                <ReactionsList reverse />
              )}
              {showDetailedReactions && isReactionEnabled && (
                <ReactionSelector ref={reactionSelectorRef} />
              )}
            </>
            {message.attachments?.length && !message.quoted_message ? (
              <Attachment actionHandler={handleAction} attachments={message.attachments} />
            ) : null}
            <MessageText message={message} />
            {message.mml && (
              <MML
                actionHandler={handleAction}
                align={isMyMessage() ? 'right' : 'left'}
                source={message.mml}
              />
            )}
            {!threadList && !!message.reply_count && (
              <div className='str-chat__message-simple-reply-button'>
                <MessageRepliesCountButton
                  onClick={handleOpenThread}
                  reply_count={message.reply_count}
                />
              </div>
            )}
            {(!groupedByUser || endOfGroup) && (
              <div className={`str-chat__message-data str-chat__message-simple-data`}>
                {!isMyMessage() && message.user ? (
                  <span className='str-chat__message-simple-name'>
                    {message.user.name || message.user.id}
                  </span>
                ) : null}
                {frmtDta(message.created_at)}
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
};
