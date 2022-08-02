import React, { useEffect, useRef, useState } from "react";
import {
  PinIcon,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import "./MessagingChannelHeader.scss";
import InviteUsers from "../InviteUsers/InviteUsers";
import { XButtonBackground } from "../../assets/XButtonBackground";
import { ChannelInfoIcon, ChannelSaveIcon, AddUser } from "../../assets";

const MessagingChannelHeader = ({ setPinsOpen }) => {
  const { client } = useChatContext();
  const { channel } = useChannelStateContext();
  const { closeThread } = useChannelActionContext();

  const [channelName, setChannelName] = useState(channel?.data.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [onInviteUser, setOnInviteUser] = useState(false);
  const inputRef = useRef();

  const members = Object.values(channel.state?.members || {});

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members.length > 0 &&
          members
            .map(
              (member) => member.user?.name || member.user?.id || "Unnamed User"
            )
            .join(", ")
      );
    }
  }, [channelName, members]);

  const updateChannel = async (e) => {
    if (e) e.preventDefault();

    if (channelName && channelName !== channel.data.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    setIsEditing(false);
  };

  const EditHeader = () => (
    <div style={{ display: "flex" }}>
      <ChannelSaveIcon />
      <form
        className="channel-header__edit-form"
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current.blur();
        }}
      >
        <input
          autoFocus
          className="channel-header__edit-input"
          onBlur={updateChannel}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Type a new name for the chat"
          ref={inputRef}
          value={channelName}
        />
      </form>
    </div>
  );
  console.log(channel);
  return (
    <div className="messaging__channel-header">
      {isEditing && channel.type !== "team" ? (
        <EditHeader />
      ) : (
        <div className="channel-header__name">
          {channelName ? (
            channel.type !== "team" ? (
              <>
                {!isEditing && (
                  <span style={{marginRight: '10px'}}>
                    <ChannelInfoIcon {...{ isEditing, setIsEditing }} />
                  </span>
                )}
                {channelName}
              </>
            ) : (
              <>
                <div>
                  <p>
                    <span>
                      {channel.data.unitCode} {` `}
                    </span>
                    <span>
                      {channel.data.firstName} {` `}
                      {channel.data.lastName} {` `}
                    </span>
                  </p>
                  <p style={{ color: "var(--bs-primary)" }}>
                    <a
                      href={`tel:+${
                        channel.data.countryCode ? channel.data.countryCode : ""
                      }${channel.data.phoneNumberRaw}`}
                    >
                      {channel.data.phoneNumber}
                    </a>
                  </p>

                  <p>
                    <b
                      className={`channel_type ${
                        channel.data.channel_type === "driver"
                          ? "driver"
                          : "other"
                      } `}
                    >
                      {channel.data.channel_type === "driver"
                        ? "unit"
                        : channel.data.recordType}
                    </b>
                  </p>
                </div>
              </>
            )
          ) : (
            <>
              {title}
              {!isEditing ? (
                <ChannelInfoIcon {...{ isEditing, setIsEditing }} />
              ) : (
                <ChannelSaveIcon />
              )}
            </>
          )}
          {channel.type === "team" && (
            <span
              onClick={() =>
                !onInviteUser ? setOnInviteUser(true) : setOnInviteUser(false)
              }
            >
              <AddUser />
            </span>
          )}
        </div>
      )}

      <div className="messaging__channel-header__right">
        {onInviteUser && client.user.role === "admin" ? (
          <>
            <InviteUsers
              onInviteUser={onInviteUser}
              onClose={() => setOnInviteUser(false)}
            />
            <div className="close-add-user-serch__btn-wrapper">
              <XButtonBackground {...{ onInviteUser, setOnInviteUser }} />
            </div>
          </>
        ) : (
          <>
            <div className="team-channel-header__right">
              <div
                className="team-channel-header__right-pin-wrapper"
                onClick={(e) => {
                  closeThread(e);
                  setPinsOpen((prevState) => !prevState);
                }}
              >
                <PinIcon />
                <p className="team-channel-header__right-text">Pins</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessagingChannelHeader);
