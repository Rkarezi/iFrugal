import React from "react";

function SortOpt(props) {
  return (
    <>
      <input
        className="selectopt"
        name="test"
        type="radio"
        id={props.type}
        value={props.order}
        title={props.title}
        defaultChecked
      />
      <label htmlFor={props.type} className="option">
        {props.name}
      </label>
    </>
  );
}

export default SortOpt;
