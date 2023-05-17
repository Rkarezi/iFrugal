import React from "react";

function Modal(props) {
  const closeMod = () => {
    props.toggled((prevState) => !prevState);
  };
  return (
    <div className="modal-body">
      <div className="modal-text">
        <span className="px-1">
          Are you sure you want to clear the database? Doing so will remove all
          scraped items
        </span>
        <form className="warning-span" onSubmit={props.cleared}>
          <button className="modal-warn danger">Yes</button>
          <button className="modal-warn green" onClick={closeMod}>
            No
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
