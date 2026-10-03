import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setQuery } from "store/slices/searchSlice";
import "./search-bar.scss";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.search.query);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
      />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
};

export default SearchBar;
