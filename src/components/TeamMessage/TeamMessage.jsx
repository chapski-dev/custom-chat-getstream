import React, { useState } from "react";
import {
  // MessageTeam,
  MessageStatus,
  useMessageContext,
  Avatar,
  useChatContext,
  // MessageSimple,
  // MessageLivestream,
  // MessageOptions,
  // Message,
} from "stream-chat-react";
import CommonModal from "../CommonModal/CommonModal";
import { CustomMessage } from "../CustomMessage/CustomMessage";
import "./TeamMessage.scss";

export const TeamMessage = (props) => {
  const { message, readBy } = useMessageContext();
  const { client } = useChatContext();

  const [showModal, setShowModal] = useState(false);
  const [howRead, setHowRead] = useState([]);
  const showReadBy = (readByUsers) => {
    if (readByUsers.filter((i) => i.name !== client.user.name).length > 0) {
      setShowModal(true);
    }
    setHowRead(readByUsers.filter((i) => i.name !== client.user.name));
  };

  return (
    <>
      <div
        className={`${message.isPinned ? "pinned-message" : "unpinned-message"}
     ${message.user.userType === "service" ? "service-message" : "regular"}`}
      >
        {"forward_message" in message && (
          <div
            className={`forward-message ${
              message.user.userType === "service" && "right"
            }`}
          >
            Forward by :
            <b>{message.message_author_name || message.message_author_id}</b>
            <p>
              <b>
                {message.channel_name ? `from: ${message.channel_name}` : ""}
              </b>
            </p>
          </div>
        )}
        {/* <MessageTeam {...props} message={message} /> */}

        {message.user.userType === "service" ? (
          <div className="service-message">
            <CustomMessage {...props} message={message} />
          </div>
        ) : (
          <div className="driver-message">
            <CustomMessage {...props} message={message} />
          </div>
        )}

        {readBy.filter((el) => el.name !== client.user.name).length > 1 ? (
          <div
            className="message-status-wrapper"
            onClick={() => {
              showReadBy(readBy);
            }}
          >
            <MessageStatus />
            <MessageStatus />
          </div>
        ) : (
          <div className="message-status-wrapper unclicked">
            <MessageStatus />
          </div>
        )}
      </div>
      <CommonModal
        madalTitle={"Read by:"}
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        children={howRead
          .filter((i) => i.name !== client.user.name)
          .map((i) => (
            <ReadByList key={i.id} user={i} />
          ))}
      />
    </>
  );
};

const ReadByList = ({ user }) => (
  <div className="channel-search__result-container">
    <div className="channel-search__result-user">
      <Avatar
        image={user.image || undefined}
        name={user.name || user.id}
        size={24}
      />
      <p className="channel-search__result-text">
        {user.name || user.id || "Johnny Blaze"}
      </p>
    </div>
  </div>
);
