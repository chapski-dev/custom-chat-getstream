import { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Avatar, useChatContext } from "stream-chat-react";
import _debounce from "lodash.debounce";
import { channelByUser } from "../ChannelSearch/utils";

const SearchResult = ({
  channel,
  focusedId,
  type,
  setChannel,
  setChannelByUser,
}) => {
  const { client, setActiveChannel } = useChatContext();
  if (type === "channel") {
    return (
      <div
        onClick={() => setChannel(channel)}
        className={
          focusedId === channel.id
            ? "channel-search__result-container__focused"
            : "channel-search__result-container"
        }
      >
        <div className="result-hashtag">#</div>
        <p className="channel-search__result-text">{channel.data.name}</p>
      </div>
    );
  }
  return (
    <div
      onClick={async () => setChannelByUser(client, setActiveChannel, channel)}
      className={
        focusedId === channel.id
          ? "channel-search__result-container__focused"
          : "channel-search__result-container"
      }
    >
      <div className="channel-search__result-user">
        <Avatar
          image={channel.image || undefined}
          name={channel.name || channel.id}
          size={24}
        />
        <p className="channel-search__result-text">
          {channel.name || channel.id || "Johnny Blaze"}
        </p>
      </div>
    </div>
  );
};

function ModalForwardMessage({
  attachments,
  channel,
  channelName,
  messageAuthorID,
  messageAuthorName,
  showModal,
  selectedMessage,
  handleClose,
}) {
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

  const setChannel = (chat) => {
    setQuery("");
    setActiveChannel(chat);
    chat.sendMessage({
      text: selectedMessage,
      attachments: attachments,
      channelName: channelName,
      message_author_name: messageAuthorName,
      message_author_id: messageAuthorID,
      forward_message: true,
    });
  };

  const setChannelByUser = (client, setActiveChannel, channel) => {
    channelByUser({
      client,
      setActiveChannel,
      channel,
      selectedMessage,
      messageAuthorName,
      messageAuthorID,
      attachments,
      channelName,
    });
  };
  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels(
        {
          type: "team",
          name: { $autocomplete: text },
        },
        {},
        { limit: 5 }
      );

      const userResponse = client.queryUsers(
        {
          id: { $ne: client.userID },
          $and: [{ name: { $autocomplete: text } }],
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

    getChannelsDebounce(event.target.value);
  };
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select forward message chat.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            {/* <Form.Label>Channel name</Form.Label> */}
            <Form.Control
              onChange={onSearch}
              type="text"
              placeholder="Start typing..."
              autoFocus
            />
          </Form.Group>
        </Form>
        <Modal.Body>
          {/* <p>Channels goes here.</p> */}
          {!!teamChannels.length && !!directChannels.length ? (
            <>
              {channel.type !== "team" && (
                <>
                  <p className="channel-search__results-header">Channels</p>
                  {!loading && !teamChannels.length ? (
                    <p className="channel-search__results-header">
                      <i>No channels found</i>
                    </p>
                  ) : (
                    teamChannels?.map((channel, i) => (
                      <SearchResult
                        channel={channel}
                        focusedId={focusedId}
                        key={i}
                        setChannel={setChannel}
                        setChannelByUser={setChannelByUser}
                        type="channel"
                      />
                    ))
                  )}
                </>
              )}

              <p className="channel-search__results-header">Users</p>

              {!loading && !directChannels.length ? (
                <p className="channel-search__results-header">
                  <i>No direct messages found</i>
                </p>
              ) : (
                directChannels?.map((channel, i) => (
                  <SearchResult
                    channel={channel}
                    focusedId={focusedId}
                    key={i}
                    setChannel={setChannel}
                    setChannelByUser={setChannelByUser}
                    type="user"
                  />
                ))
              )}
            </>
          ) : null}
        </Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Forward
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalForwardMessage;
