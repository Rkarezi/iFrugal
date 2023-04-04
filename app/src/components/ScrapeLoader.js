import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ReactBootStrap from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
function ScrapeLoader() {
  const [isComplete, setComplete] = useState(false);
  const [isSave, setSave] = useState("");
  const socket = io("http://localhost:3000");
  var loadInterval;
  const navigate = useNavigate();
  function checkCompletion() {
    axios.get("http://localhost:3004/scrapeStatus").then((resp) => {
      if (isSave != "SAVE") {
        axios.get("http://localhost:3004/saveReady").then((resp) => {
          const saved = resp.data;
          setSave(saved);
        });
      }
      if (resp.data == "Completed") {
        setComplete(true);
        clearInterval(loadInterval);
        setTimeout(function () {
          socket.disconnect();
          navigate(0);
        }, 2000);
      } else {
        setComplete(false);
      }
    });
  }
  loadInterval = setInterval(checkCompletion, 2500);
  useEffect(() => {
    return () => {
      socket.disconnect();
      clearInterval(loadInterval);
    };
  }, []);

  const onSave = () => {
    setComplete(true);
    socket.disconnect();
    clearInterval(loadInterval);
    setTimeout(function () {
      navigate(0);
    }, 1000);
  };

  return (
    <div className="loader">
      {!isComplete ? (
        <>
          <div className="d-flex justify-content-center align-items-center h-50">
            <div className="center-ele">
              <h1 className="header-info">iFrugal</h1>
              <h3>Scraping data please wait...</h3>
              {isSave == "SAVE" ? (
                <h6>Ready to save</h6>
              ) : (
                <h6>Data not ready to save</h6>
              )}
              <div className="spinner-logo">
                {
                  <ReactBootStrap.Spinner animation="border"></ReactBootStrap.Spinner>
                }
              </div>
            </div>
          </div>
          <form className="btn-container" onSubmit={onSave}>
            <button
              className="scrape-btn"
              style={{ display: isSave == "SAVE" ? "inline-block" : "none" }}
            >
              Cancel
            </button>
          </form>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center header-info">
          <h3>Scraping complete! Refreshing server with new data...</h3>
        </div>
      )}
    </div>
  );
}

export default ScrapeLoader;
