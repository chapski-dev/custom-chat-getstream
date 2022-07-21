import React from "react";
import { SearchIcon } from "../../assets";

const SearchInput = ({ query, onSearch, dark }) => {
  return (
    <div className={`channel-search__input__wrapper ${dark ? `dark` : null}`}>
      <div className="channel-search__input__icon">
        <SearchIcon />
      </div>
      <input
        className="channel-search__input__text"
        onChange={onSearch}
        placeholder="Search"
        type="text"
        value={query}
      />
    </div>
  );
};

export default SearchInput;
