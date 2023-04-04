import React from "react";
import { Link } from "react-router-dom";
function CatalogItem(props) {
  return (
    <div className="col-3 all-av content-wrapper all-img">
      <Link to="/catalog" state={{ type: props.itemType }}>
        <img src={props.imgSrc} className="all-av"></img>
        <span className="category fade">All {props.itemType}</span>
      </Link>
    </div>
  );
}

export default CatalogItem;
