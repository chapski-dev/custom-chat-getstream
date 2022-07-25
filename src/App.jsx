import React, { useState, useEffect  } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, enTranslations, Streami18n } from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';
import './App.scss';

import { useChecklist } from './ChecklistTasks';
import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from './components/ChannelListContainer/ChannelListContainer';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const theme = urlParams.get('theme') || 'light';
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;
const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

const client = StreamChat.getInstance(apiKey, { enableInsights: true, enableWSFallback: true });
client.connectUser({ id: user }, userToken);
// ?apikey=952bqynne8fg&user=service_33&user_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2VydmljZV8zMyJ9.tZ66ZhXTgCnc-5wbd3CXFKgWdKyS1t8Gb3CjZuq7pkY

const filters = [
  {
    type: "team",
    members: { $in: [client.userID] },
    joined: true,
  },
  { type: 'messaging', 
  joined: true, 
},
];
const options = { state: true, watch: true, presence: true, limit: 13 };
const sort = { last_message_at: -1, updated_at: -1 };

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useChecklist(client, targetOrigin);
  useEffect(() => {

    client.on(event => {
      if (event.type === 'message.new' && event.unread_count > 0) {
        console.log(`(${event.user.name}) ${event.message.text}`)
        new Notification(event.user.name, {
          body: event.message.text,
        });
      }
      if (event.total_unread_count !== null && event.total_unread_count !== undefined) {
        if(event.total_unread_count===0){
          document.getElementById('favicon').href =  'favicon.ico';
          document.title = 'Xpel Chat';
        } else {
          document.getElementById('favicon').href =  'unread_favicon.ico';
          document.title = `(${event.total_unread_count}) Xpel Chat`;
        }
      }
   
    //if (event.unread_channels !== null && event.unread_channels !== undefined) {
    //  console.log(`unread channels count is now: ${event.unread_channels}`);
    //}
    });
    grantPermission();
  }, []);
  function grantPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  return (
    <>
      <div className='app__wrapper'>
        <Chat {...{ client, i18nInstance }} theme={`team ${theme}`}>
          <ChannelListContainer
            {...{
              isCreating,
              filters,
              options,
              setCreateType,
              setIsCreating,
              setIsEditing,
              sort,
            }}
          />
          <ChannelContainer
            {...{
              createType,
              isCreating,
              isEditing,
              setIsCreating,
              setIsEditing,
            }}
          />
        </Chat>
      </div>
    </>
  );
};

export default App;
