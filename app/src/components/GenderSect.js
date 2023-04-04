import React from "react";
import { Link } from "react-router-dom";
import mAcs2 from "../resrc/macs3-1.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import asset1 from "../resrc/asset1-2.jpg";
import asset2 from "../resrc/asset2.jpg";
import asset3 from "../resrc/w-asset3.jpeg";
import mAsset1 from "../resrc/m_asset1.jpg";
import mAsset2 from "../resrc/m-asset2-2.jpg";

function GenderSect(props) {
  console.log(props.gender);
  return (
    <div className="main-container">
      <Link to="/" className="back">
        <ArrowBackIcon></ArrowBackIcon>
      </Link>
      <div className="form-body">
        <div className="main-imgs">
          <div className="content-wrapper img-wrap">
            <Link
              to="/catalog"
              state={{
                type: "shoes",
                category: props.gender,
              }}
              className="anchor"
            >
              <img
                src={props.gender === "Men" ? mAsset2 : asset2}
                className="cat-imgL"
              ></img>
              <span className="category fade"> {props.gender}'s Shoes</span>
            </Link>
          </div>
          <div className="content-wrapper img-wrap">
            <Link
              to="/catalog"
              state={{
                type: "clothes",
                category: props.gender,
              }}
              className="anchor"
            >
              <img
                src={props.gender === "Men" ? mAsset1 : asset1}
                className="cat-imgL"
              ></img>
              <span className="category fade"> {props.gender}'s Clothes</span>
            </Link>
          </div>
        </div>
        <div className="sec-img">
          <div className="drop-img content-wrapper">
            <Link
              to="/catalog"
              className="anchor"
              state={{
                type: "accessories",
                category: props.gender,
              }}
            >
              <img
                src={props.gender === "Men" ? mAcs2 : asset3}
                className="cat-img"
              ></img>
              <span className="category fade">
                {props.gender}'s Accessories
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenderSect;
