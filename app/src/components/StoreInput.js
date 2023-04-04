import React from "react";

function StoreInput(props) {
  return (
    <div className="scrape-container">
      <div className="scrape-input">
        <input
          type="radio"
          value={props.val}
          name="toggle-input"
          disabled={props.disable}
        ></input>
        <img className="store-logo" src={props.img}></img>
      </div>
    </div>
  );
}

export default StoreInput;
