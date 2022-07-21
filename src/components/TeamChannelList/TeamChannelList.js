import React from "react";

import "./TeamChannelList.css";

import { AddUser } from "../../assets";

const ChannelList = ({
  children,
  error = false,
  loading,
  setCreateType,
  setIsCreating,
  setIsEditing,
  type,
}) => {
  if (error) {
    return (
      type === "team" && (
        <div className="team-channel-list">
          <p className="team-channel-list__message">
            Connection error, please wait a moment and try again.
          </p>
        </div>
      )
    );
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === "team" ? "Channels" : "Messages"} loading....
        </p>
      </div>
    );
  }

  if (type !== "team") {
    return (
      <div className="team-channel-list">
        <div className="team-channel-list__header">
          <p className="team-channel-list__header__title">Create DM</p>
          <span 
            onClick={() => {
              setCreateType(type);
              setIsCreating((prevState) => !prevState);
              setIsEditing(false);
            }}
            style={{ color: "#fff" }}
          >
            <AddUser
              type={type === "team" ? "team" : "messaging"}
            />
          </span>
        </div>
        {children}
      </div>
    );
  }

  return <div className="team-channel-list">{children}</div>;
};

export const TeamChannelList = React.memo(ChannelList);
