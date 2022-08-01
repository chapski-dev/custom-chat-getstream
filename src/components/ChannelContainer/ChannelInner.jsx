import React, { useState } from "react";
import { logChatPromiseExecution } from "stream-chat";
import {
  defaultPinPermissions,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
} from "stream-chat-react";
import MessagingChannelHeader from "../MessagingChannelHeader/MessagingChannelHeader";
import { PinnedMessageList } from "../PinnedMessageList/PinnedMessageList";
import { ThreadMessageInput } from "../TeamMessageInput/ThreadMessageInput";
import ModalForwardMessage from "../ModalForwardMessage/ModalForwardMessage";

export const ChannelInner = (props) => {
  const { pinsOpen, setIsEditing, setPinsOpen, channel } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [channelName, setChannelName] = useState("");
  const [messageAuthorID, setMessageAuthorID] = useState("");
  const [messageAuthorName, setMessageAuthorName] = useState("");
  const [attachments, setAttachments] = useState();
  

  const { sendMessage } = useChannelActionContext();

  const teamPermissions = { ...defaultPinPermissions.team, user: true };
  const messagingPermissions = {
    ...defaultPinPermissions.messaging,
    user: true,
  };
  const pinnedPermissions = {
    ...defaultPinPermissions,
    team: teamPermissions,
    messaging: messagingPermissions,
  };

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    // TODO: Выяснить почечему так происходит и как с этим бороться

    // function escapeRegExp(text) {
    //   return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
    // }
    // console.log(escapeRegExp(message.text));

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, "send message");
    }
  };

  const forwardActionHandler = (mes) => {
    if (channel.data.name) {
      setChannelName(channel.data.name)
    }
    if(mes.attachments.length) {
      setAttachments(mes.attachments)
    }
    setMessageAuthorID(mes.user.id);
    setMessageAuthorName(mes.user.name);
    setSelectedMessage(mes.text);
    setShowModal(true);
  };

  const customMessageActions = { Forward: forwardActionHandler };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Window>
        <MessagingChannelHeader {...{ setIsEditing, setPinsOpen }} />
        <MessageList
          returnAllReadData // показывает статус прочитанного сообщения ко всем отдельно взятым сообщениям
          customMessageActions={customMessageActions}
          messageActions={["mute", "pin", "quote", "react"]}
          pinPermissions={pinnedPermissions}
        />
        <MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread
        additionalMessageInputProps={{
          grow: true,
          Input: ThreadMessageInput,
        }}
      />

      {pinsOpen && <PinnedMessageList setPinsOpen={setPinsOpen} />}
      {/* {pinsOpen && <PinnedMessageList setPinsOpen={setPinsOpen} />} */}
      <ModalForwardMessage
        channel={channel}
        attachments={attachments}
        channelName={channelName}
        messageAuthorID={messageAuthorID}
        messageAuthorName={messageAuthorName}
        showModal={showModal}
        selectedMessage={selectedMessage}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
