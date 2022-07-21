import React, { useEffect, useState } from 'react';
import { useChannelActionContext, useChannelStateContext } from 'stream-chat-react';

import './MessageReadUsers.css';

import { CloseThreadIcon } from '../../assets';

export const MessageReadUsers = (props) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext();

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        <Users/>
      </div>
    </div>
  );
};

const Users = () => {
  const { channel } = useChannelStateContext();
  const [channelUsers, setChannelUsers] = useState([]);

  useEffect(() => {
    const updateChannelUsers = () => {
      setChannelUsers(
        Object.values(channel.state.members).map((user) => ({user}))
      );
    };

    updateChannelUsers();
  }, [channel]);

  return (
    <ul className="users-list">
      {channelUsers.map((member) => (
        <li key={member.name}>
          {member.name} - {member.online ? "online" : "offline"}
        </li>
      ))}
    </ul>
  );
};
