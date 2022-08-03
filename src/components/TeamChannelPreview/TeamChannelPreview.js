import React from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import "./TeamChannelPreview.scss";

import { TeamTypingIndicator } from "../TeamTypingIndicator/TeamTypingIndicator";

export const TeamChannelPreview = ({
  channel,
  setActiveChannel,
  setIsCreating,
  setIsEditing,
  type,
}) => {
  const { channel: activeChannel, client } = useChatContext();
  const ChannelPreview = () => {
    return (
      <p className="channel-preview__item">
        {channel.countUnread() > 0 && channel.countUnread() <= 100 ? (
          <span className="channel-preview__unread-message-count">
            {channel.countUnread()}
          </span>
        ) : channel.countUnread() > 100 ? (
          <span className="channel-preview__unread-message-count channel-preview__unread-message-count_big">
            +100
          </span>
        ) : null}
        <span>
          {channel.data.unitCode} {` `}
        </span>
        <span>
          {channel.data.firstName} {` `}
          {channel.data.lastName} {` `}
        </span>
        <p>
          {channel.data.phoneNumber}
        </p>
        <p>
          <b
            className={`channel_type ${channel.data.channel_type === 'driver' ? 'driver': 'other'} `}
          >
            {channel.data.channel_type === 'driver' ? 'unit': channel.data.recordType }
          </b>
        </p>
      </p>
    );
  };

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    const defaultName = "Johnny Blaze";

    if (!members.length || members.length === 1) {
      return (
        <div className="channel-preview__item single">
          {channel.countUnread() > 0 && channel.countUnread() <= 100 ? (
            <div className="channel-preview__unread-message-count">
              {channel.countUnread()}
            </div>
          ) : channel.countUnread() > 100 ? (
            <div className="channel-preview__unread-message-count channel-preview__unread-message-count_big">
              +100
            </div>
          ) : null}
          <Avatar
            image={members[0]?.user.image || undefined}
            name={channel.data.name || members[0]?.user.name || members[0]?.user.id}
            size={24}
          />
          <p>{channel.data.name || members[0]?.user.name || members[0]?.user.id || defaultName}</p>
          <TeamTypingIndicator type="list" />
        </div>
      );
    }

    return (
      <div className="channel-preview__item multi">
        <span>
          <Avatar
            image={members[0]?.user.image || undefined}
            name={channel.data.name || members[0]?.user.name || members[0]?.user.id}
            size={18}
          />
        </span>
        <Avatar
          image={members[1]?.user.image || undefined}
          name={channel.data.name || members[1]?.user.name || members[1]?.user.id}
          size={18}
        />
        <p>
          {channel.data.name || members[0]?.user.name || members[0]?.user.id || defaultName},{" "}
          {channel.data.name || members[1]?.user.name || members[1]?.user.id || defaultName}
        </p>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? "channel-preview__wrapper__selected"
          : "channel-preview__wrapper"
      }
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setActiveChannel(channel);
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};
