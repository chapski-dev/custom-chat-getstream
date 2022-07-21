import React from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { ChannelSearch } from "../ChannelSearch/ChannelSearch";
import { TeamChannelList } from "../TeamChannelList/TeamChannelList";
import { TeamChannelPreview } from "../TeamChannelPreview/TeamChannelPreview";
import { SideBarFlag, SideBarLogo } from "../../assets";
import LoadMorePaginatorBtn from "./../LoadMorePaginatorBtn/LoadMorePaginatorBtn";

import "./ChannelListContainer.css";

const SideBar = () => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <SideBarLogo />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon2__inner">
        <SideBarFlag />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => {
  const { client } = useChatContext();
  return (
    <div className="channel-list__header">
      <p className="channel-list__header__text">
        {client.user.name || client.user.id}
      </p>
    </div>
  );
};

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === "team");
};

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === "messaging");
};

export const ChannelListContainer = ({
  filters,
  options,
  setCreateType,
  setIsCreating,
  setIsEditing,
  sort,
}) => {
  return (
    <div className="channel-list__container">
      <SideBar />
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch />
        <Tabs
          defaultActiveKey="channels"
          id="uncontrolled-tab-example"
        >
          <Tab eventKey="channels" title="Channels">
            <>
              <ChannelList
                channelRenderFilterFn={customChannelTeamFilter}
                filters={filters[0]}
                options={options}
                sort={sort}
                List={(listProps) => (
                  <TeamChannelList
                    {...listProps}
                    {...{ setCreateType, setIsCreating, setIsEditing }}
                    type="team"
                  />
                )}
                Preview={(previewProps) => (
                  <TeamChannelPreview
                    {...previewProps}
                    {...{ setIsCreating, setIsEditing }}
                    type="team"
                  />
                )}
              />
              <LoadMorePaginatorBtn />
            </>
          </Tab>
          <Tab eventKey="direct" title="Direct Messages">
            <>
              <ChannelList
                channelRenderFilterFn={customChannelMessagingFilter}
                filters={filters[1]}
                options={options}
                setActiveChannelOnMount={false}
                sort={sort}
                List={(listProps) => (
                  <TeamChannelList
                    {...listProps}
                    {...{ setCreateType, setIsCreating, setIsEditing }}
                    type="messaging"
                  />
                )}
                Preview={(previewProps) => (
                  <TeamChannelPreview
                    {...previewProps}
                    {...{ setIsCreating, setIsEditing }}
                    type="messaging"
                  />
                )}
              />
              <LoadMorePaginatorBtn />
            </>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
