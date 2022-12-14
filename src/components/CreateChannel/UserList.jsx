import SearchInput from "./../SearchInput/SearchInput";
import _debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import "./UserList.css";

import { InviteIcon } from "../../assets";
import { Button, Spinner } from "react-bootstrap";

const ListContainer = ({ inputText, onSearch, children }) => {
  return (
    <>
      <SearchInput dark onSearch={onSearch} query={inputText} />
      <div className="user-list__container">
        <div className="user-list__header">
          <p>User</p>
          <p>Invite</p>
        </div>
        {children}
      </div>
    </>
  );
};

const UserItem = React.memo(({ setSelectedUsers, user }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected(!selected);
  };

  return (
    <div className="user-item__wrapper" onClick={handleClick}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.name || user.id} size={32} />
        <p className="user-item__name">{user.name || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
});

export const UserList = (props) => {
  const { setSelectedUsers } = props;

  const { client } = useChatContext();

  const [error, setError] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [cacheUsers, setCacheUsers] = useState(1);
  const [hideLoadMoreBtn, setHideLoadMoreBtn] = useState(false);

  const [searching, setSearching] = useState(false);
  const [inputText, setInputText] = useState("");
  const [optionLimits, setOptionLimits] = useState(10);

  useEffect(() => {
    if (inputText.length > 1) {
      findUsersDebounce();
    } else {
      setListEmpty(false);
      const getUsers = async () => {
        if (loading) return;
        setLoading(true);

        try {
          const response = await client.queryUsers(
            { id: { $ne: client.userID }, userType: "service" },
            { id: 1 },
            { limit: optionLimits }
          );

          if (response.users.length) {
            setUsers(response.users);
          } else {
            setListEmpty(true);
          }
        } catch (event) {
          setError(true);
        }

        setLoading(false);
      };

      if (client) getUsers();
    }
  }, [inputText, optionLimits]); // eslint-disable-line react-hooks/exhaustive-deps

  const findUsers = async () => {
    !!inputText && setSearching(false);
    if (searching) return;
    setSearching(true);
    if (!!inputText) {
      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID },
            $and: [{ name: { $autocomplete: inputText } }],
            userType: "service",
          },
          { id: 1 },
          { limit: 10 }
        );

        if (response.users.length) {
          setSearching(false);
          setListEmpty(false);
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
        console.log({ error });
      }
    }

    setLoading(false);
  };
  const findUsersDebounce = _debounce(findUsers, 100, {
    trailing: true,
  });

  const onSearch = (event) => {
    event.preventDefault();
    setInputText(event.target.value);
    if (!event.target.value) return;
    findUsersDebounce(event.target.value);
  };

  useEffect(() => {
    if (users && cacheUsers === users.length) {
      setHideLoadMoreBtn(true);
    }
  }, [cacheUsers, users]);

  const loadMoreUsers = () => {
    setOptionLimits((prevState) => prevState + 10);
    setUsers((prevState) => {
      setCacheUsers(prevState.length);
    });
  };

  if (error) {
    return (
      <ListContainer inputText={inputText} onSearch={onSearch}>
        <div className="user-list__message">
          Error loading, please refresh and try again.
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer inputText={inputText} onSearch={onSearch}>
        <div className="user-list__message">No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer inputText={inputText} onSearch={onSearch}>
      {loading ? (
        <Spinner
          style={{ alignSelf: "center" }}
          animation="border"
          role="status"
          variant="primary"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        users?.length &&
        users.map((user, i) => (
          <UserItem
            index={i}
            key={user.id}
            setSelectedUsers={setSelectedUsers}
            user={user}
          />
        ))
      )}
      {!inputText && !hideLoadMoreBtn && (
        <Button
          style={{
            width: "fit-content",
            alignSelf: "center",
            marginTop: "20px",
          }}
          variant="primary"
          onClick={loadMoreUsers}
        >
          Load More
        </Button>
      )}
    </ListContainer>
  );
};
