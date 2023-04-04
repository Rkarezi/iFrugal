import React, { useRef } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
function Navbar(props) {
  const searchRef = useRef();
  const handleSearch = async (e) => {
    e.preventDefault();

    const itemsFromServer = await props.getItems(props.page);
    props.setProducts(itemsFromServer);
    const input = document.getElementsByTagName("input")[0];
    input.value = "";
    props.setRemountComponent(Math.random());
  };

  const searchClick = () => {
    props.setIsShow(true);
    if (!props.isShow) {
      searchRef.current.style.display = "block";
    } else {
      searchRef.current.style.display = "none";
      props.setIsShow(false);
    }
  };

  const searchHide = () => {
    const searchHide = document.getElementById("search-hide");
    searchHide.value = "";
    searchHide.blur();
  };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        iFrugal
      </Link>
      <div className="search-box">
        <form name="search" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            id="search-hide"
            onChange={(e) => props.setSearch(e.target.value)}
            onMouseOut={searchHide}
            autoComplete="off"
          />
        </form>
        <div className="search-button">
          <InputAdornment>
            <IconButton onClick={() => searchClick() && !props.isShow}>
              <SearchIcon className="search-logo"></SearchIcon>
            </IconButton>
          </InputAdornment>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
