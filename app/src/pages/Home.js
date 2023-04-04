import React from "react";
import { Link } from "react-router-dom";
import CatalogItem from "../components/CatalogItem";
import mens from "../resrc/MM.jpeg";
import mainShoes3 from "../resrc/mainshoes3.jpg";
import mainAcs from "../resrc/mainAcs.jpeg";
import mainClohtes3 from "../resrc/mainClothes3.jpeg";
import womens6 from "../resrc/WM.jpeg";
function Home() {
  let catalogArray = [
    { type: "shoes", img: mainShoes3 },
    { type: "clothes", img: mainClohtes3 },
    { type: "accessories", img: mainAcs },
  ];

  return (
    <div>
      <div className="brand">
        <h1>iFrugal</h1>
        <Link to="/stores">
          <h5 className="store-link">Stores</h5>
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="imgs-div">
          <Link
            to="/gender"
            state={{ category: "Men" }}
            className="anchor-link"
          >
            <img src={mens} className="imgsrc"></img>
            <div>
              <h6 className="sect-title">Mens</h6>
            </div>
          </Link>
          <Link
            to="/gender"
            state={{ category: "Women" }}
            className="anchor-link"
          >
            <img src={womens6} className="imgsrc"></img>
            <div className="title-container">
              <h6 className="sect-title">Womens</h6>
            </div>
          </Link>
        </div>
      </div>
      <div className="row catalog-av">
        {catalogArray.map((catalog) => {
          return <CatalogItem itemType={catalog.type} imgSrc={catalog.img} />;
        })}
      </div>
    </div>
  );
}

export default Home;
