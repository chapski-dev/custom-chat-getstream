import React, { useEffect, useRef, useState } from "react";
import {
  PinIcon,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

import "./MessagingChannelHeader.css";

import InviteUsers from "../InviteUsers/InviteUsers";
import { XButtonBackground } from "../../assets/XButtonBackground";
import { AddUser } from "./../../assets/AddUser";

const MessagingChannelHeader = ({ setPinsOpen }) => {
  const { client } = useChatContext();
  const { channel } = useChannelStateContext();
  const { closeThread } = useChannelActionContext();

  const [channelName] = useState(channel?.data.name);
  const [isEditing] = useState(false);
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

  return (
    <div className="messaging__channel-header">
      <div className="channel-header__name">
        {channelName ? (
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
                  href={`tel:+${channel.data.countryCode}${channel.data.phoneNumberRaw}`}
                >
                  {channel.data.phoneNumber}
                </a>
              </p>

              <p>
                <b
                  className={`channel_type ${
                    channel.data.channel_type === "driver" ? "driver" : "other"
                  } `}
                >
                  {channel.data.channel_type === "driver"
                    ? "unit"
                    : channel.data.recordType}
                </b>
              </p>
            </div>
          </>
        ) : (
          title
        )}
        {/* {channelName || title}{" "} */}
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
