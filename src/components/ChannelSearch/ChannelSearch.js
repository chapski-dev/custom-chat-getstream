import React, { useCallback, useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import _debounce from "lodash.debounce";

import "./ChannelSearch.scss";

import { ResultsDropdown } from "./ResultsDropdown";
import SearchInput from "../SearchInput/SearchInput";
import axios from "axios";

const urlParams = new URLSearchParams(window.location.search);
const envFromRequest = urlParams.get('env') || "s";


export const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext();

  const [allChannels, setAllChannels] = useState([]);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  const [focused, setFocused] = useState(undefined);
  const [focusedId, setFocusedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowDown") {
        setFocused((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === allChannels.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === "ArrowUp") {
        setFocused((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? allChannels.length - 1 : prevFocused - 1;
        });
      } else if (event.keyCode === 13) {
        event.preventDefault();
        setActiveChannel(allChannels[focused]);
        setFocused(undefined);
        setFocusedId("");
        setQuery("");
      }
    },
    [allChannels, focused, setActiveChannel]
  );

  useEffect(() => {
    if (query) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, query]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  useEffect(() => {
    if (focused >= 0) {
      setFocusedId(allChannels[focused]?.id);
    }
  }, [allChannels, focused]);

  const setChannel = (channel) => {
    setQuery("");
    setActiveChannel(channel);
  };

  const getChannels = async (text) => {

    // const phoneNumberCandidate = text.replace(/\D/g, '').trim();

    const urlBase = (envFromRequest === "s") ? "https://sandbox.xpel1.com" : "https://app.xpel.app";
    const url = `${urlBase}/utils/search_channel?q=${text}`;

    const channelListFromBackend = await axios.get(url);

    // TODO: We need to add error check there

    let filter;

    if (channelListFromBackend['data'].length > 0) {
      filter = {
        cid: {$in: channelListFromBackend['data']}
      };
    } else {
      filter = {
        name: {$autocomplete: text.trim()}
      }
    }

    // const filter = (phoneNumberCandidate === "") ?
    //     {
    //       name: { $autocomplete: text.trim() }
    //     }
    //     :
    //     {
    //       $or: [
    //         {
    //           name: { $autocomplete: text.trim() },
    //         },
    //         {
    //           phoneNumberRaw: { $autocomplete:  phoneNumberCandidate } ,
    //           // phoneNumberRaw: { $where: function() {
    //           //     return (this['phoneNumberRaw'] && this['phoneNumberRaw'].includes(phoneNumberCandidate))
    //           //   }
    //           // }
    //         }
    //       ],
    //     };


    const sort = {};
    const options = { limit: 10 };

    try {
      const channelResponse = client.queryChannels(filter, sort, options);

      const userResponse = client.queryUsers(
        {
          id: { $ne: client.userID },
          $and: [{ name: { $autocomplete: text } }],
          userType: 'service',
        },
        { id: 1 },
        { limit: 5 }
      );

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setAllChannels(channels.concat(users));
    } catch (e) {
      setQuery("");
      console.log(e);
    }

    setLoading(false);
  };

  const getChannelsDebounce = _debounce(getChannels, 100, {
    trailing: true,
  });

  const onSearch = (event) => {
    event.preventDefault();

    setLoading(true);
    setFocused(undefined);
    setQuery(event.target.value);
    if (!event.target.value) return;
    if (event.target.value.length > 1) {
      getChannelsDebounce(event.target.value);
    }
  };

  return (
    <div className="channel-search__container">
      <SearchInput query={query} onSearch={onSearch} />
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          focusedId={focusedId}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
