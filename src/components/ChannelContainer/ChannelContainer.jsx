import React, { useState } from 'react';
import { Channel, useChatContext, DateSeparator } from 'stream-chat-react';
import { ChannelInner } from './ChannelInner';
import { ChannelEmptyState } from '../ChannelEmptyState/ChannelEmptyState';
import { CreateChannel } from '../CreateChannel/CreateChannel';
import { EditChannel } from '../EditChannel/EditChannel';
import { TeamMessage } from '../TeamMessage/TeamMessage';
import Moment from 'moment-timezone';

import './ChannelContainer.css';

export const ChannelContainer = (props) => {
  const { createType, isCreating, isEditing, setIsCreating, setIsEditing } = props;

  const { channel } = useChatContext();

  const [pinsOpen, setPinsOpen] = useState(false);
  if (isCreating) {
    const filters = {};

    return (
      <div className='channel__container'>
        <CreateChannel {...{ createType, filters, setIsCreating }} />
      </div>
    );
  }

  if (isEditing) {
    const filters = {};

    if (channel?.state?.members) {
      const channelMembers = Object.keys(channel.state.members);
      if (channelMembers.length) {
        filters.id = { $nin: channelMembers };
      }
    }

    return (
      <div className='channel__container'>
        <EditChannel {...{ filters, setIsEditing }} />
      </div>
    );
  }
  const frmtDta= function(date){
    //const timeZone = Moment(date).tz("America/Los_Angeles").isDST()? "PDT" : "PST";
    return Moment(date).tz("America/Los_Angeles").format("MMMM, DD YYYY");
  }

  return (
    <div className='channel__container'>
      <Channel
        EmptyStateIndicator={ChannelEmptyState}
        DateSeparator={(messageProps)=>(
          <DateSeparator
            {...messageProps} formatDate={frmtDta}
          />
        )}
        // Input={TeamMessageInput} // Вариант кастомного инпута. Если не подключен ставится дефолтный инпут.
        Message={(messageProps, i) => (
          <TeamMessage
            key={i}
            {...messageProps}
            {...{ setPinsOpen }}
          />
        )}
        TypingIndicator={() => null}
      >
        <ChannelInner
          {...{
            pinsOpen,
            setIsEditing,
            setPinsOpen,
            channel
          }}
        />
      </Channel>
    </div>
  );
};
