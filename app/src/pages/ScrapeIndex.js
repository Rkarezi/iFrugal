import React, { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DJLOGO from "../resrc/DJLOGO.jpeg";
import TILOGO from "../resrc/the-iconic-logo-vector.png";
import MTLOGO from "../resrc/MTLOGO.jpeg";
import GSLOGO from "../resrc/GSLOGO.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScrapeLoader from "../components/ScrapeLoader";
import StoreInput from "../components/StoreInput";
import Modal from "../components/Modal";
function ScrapeIndex() {
  const btnRef = useRef();
  const [loader, setLoader] = useState(false);
  const [isDisable, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  let inputArray = [
    { val: 0, img: MTLOGO },
    { val: 1, img: TILOGO },
    { val: 2, img: DJLOGO },
    { val: 3, img: GSLOGO },
  ];
  let storeIndex;
  const getStore = (event) => {
    if (document.activeElement) {
      const inputDis = document.getElementsByName("toggle-input");
      inputDis.forEach((toggle) => {
        if (toggle.value != document.activeElement.value) {
          toggle.disabled = true;
        }
      });
    }
    storeIndex = event.target.value;
  };

  const toggleMod = (e) => {
    e.preventDefault();
    setToggle(true);
  };
  const clearDB = (e) => {
    e.preventDefault();
    setToggle(false);
    setTimeout(function () {
      window.location.reload(false);
      setActive(false);
    }, 2000);
    setActive((prevVal) => !prevVal);
    axios
      .post("http://localhost:3004/clear", {
        db: "db",
      })
      .then((resp) => {
        if (resp.data == "Database cleared") {
          setTimeout(function () {
            btnRef.current.style.color = "black";
          }, 2000);
          btnRef.current.style.color = "green";
        } else {
          setTimeout(function () {
            btnRef.current.style.color = "black";
          }, 2000);
          btnRef.current.style.color = "red";
        }
      });
  };

  const sendStores = (e) => {
    if (storeIndex) {
      axios.post("http://localhost:3004/stores", {
        data: storeIndex,
      });

      setLoader(true);
    } else {
      e.preventDefault();
    }
  };

  const loadComp = () => {
    setLoader(true);
  };
  return (
    <div className="main-container">
      {!loader ? (
        <>
          <Link to="/" className="back">
            <ArrowBackIcon></ArrowBackIcon>
          </Link>
          <form onSubmit={(e) => sendStores(e)} className="form-body">
            <div className="scrape-body" onChange={getStore}>
              {inputArray.map((input) => (
                <StoreInput
                  val={input.val}
                  img={input.img}
                  disable={isDisable}
                ></StoreInput>
              ))}
              <div className="btn-container">
                <button className="scrape-btn">Scrape</button>
                <span className="header-info">Alternatively</span>
              </div>
            </div>
          </form>
          <form onSubmit={toggleMod} className="btn-container clear">
            <button className="clear-btn" ref={btnRef} disabled={isDisable}>
              Clear Database
            </button>
          </form>
          {toggle ? (
            <div className="d-flex justify-content-center align-items-center">
              <Modal toggled={setToggle} cleared={clearDB}></Modal>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <ScrapeLoader></ScrapeLoader>
      )}
    </div>
  );
}

export default ScrapeIndex;
