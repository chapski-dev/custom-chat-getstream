import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import './EditChannel.css';

import { UserList } from '../CreateChannel/UserList';

import { CloseCreateChannel } from '../../assets';


export const EditChannel = ({ filters, setIsEditing }) => {
  const { channel } = useChatContext();

  const [channelName, setChannelName] = useState(channel?.data.name || channel?.data.id);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if (nameChanged) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` },
      );
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p>Invite members</p>
        <CloseCreateChannel {...{ setIsEditing }} />
      </div>
      <UserList {...{ filters, setSelectedUsers }} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};
