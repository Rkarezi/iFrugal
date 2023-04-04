import React from "react";
import { Link } from "react-router-dom";
function Products({ item }) {
  return (
    <div className="col-sm-6 col-md-4 my-2 anchor-link">
      <Link to={`//${item.click}`} target="_blank" className="anchor-link">
        <div className="center-ele">
          <div className="card-container w-100">
            <div className="card-body">
              <i className="text-wrap">
                {item.brand} ({item.title})
              </i>
              <figure className="item">
                {
                  <img
                    src={item.img ? item.img : item.img1}
                    className="fig-img"
                  ></img>
                }

                <figcaption className="caption">
                  <h6
                    className="original"
                    style={{
                      display: item.priceOG == 0 ? "none" : "block",
                    }}
                  >
                    {Number(item.priceOG).toLocaleString("en-US", {
                      style: "currency",
                      currency: "AUD",
                    })}
                  </h6>
                  <h6 className="final">
                    {item.priceCurr && item.priceFL == 0
                      ? Number(item.priceCurr).toLocaleString("en-US", {
                          style: "currency",
                          currency: "AUD",
                        })
                      : item.priceCurr1 != "" && item.priceFL == 0
                      ? "Price Varies"
                      : item.priceFL
                      ? Number(item.priceFL).toLocaleString("en-US", {
                          style: "currency",
                          currency: "AUD",
                        })
                      : Number(item.priceOG).toLocaleString("en-US", {
                          style: "currency",
                          currency: "AUD",
                        })}
                  </h6>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Products;
