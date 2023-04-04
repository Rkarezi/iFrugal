import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Products from "../components/Products";
import Navbar from "../components/Navbar";
import Sort from "../components/Sort";
function CatalogContent() {
  const linkRef = useRef(" ");
  let typeVal = useLocation().state;
  let cateVal = useLocation().state;
  typeVal != null ? (typeVal = typeVal.type) : (typeVal = "");
  cateVal != null ? (cateVal = cateVal.category) : (cateVal = "");
  let productType = typeVal.charAt(0).toUpperCase() + typeVal.slice(1);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [remountComponent, setRemountComponent] = useState(0);
  const [total, setTotal] = useState(0);
  let page;
  const limit = 30;

  useEffect(() => {
    const initialFetch = async () => {
      const data = await fetch(
        `http://localhost:3004/${typeVal}?_page=1&_limit=${limit}${
          cateVal ? `&gender=${cateVal}` : ""
        }`
      );
      const products = await data.json();
      const total = data.headers.get("x-total-count");
      setTotal(total);
      const pageCount = Math.ceil(total / 30);
      setPageCount(pageCount);
      setProducts(products);
    };
    initialFetch();
  }, []);

  const getItems = async (page) => {
    const res = await fetch(
      `http://localhost:3004/${typeVal}?_page=${page}&_limit=${limit}${
        linkRef.current
      }&q=${search}${cateVal ? `&gender=${cateVal}` : ""}`
    );
    const getData = await res.json();
    const total = res.headers.get("x-total-count");
    setTotal(total);
    const pageCount = Math.ceil(total / 30);
    setPageCount(pageCount);
    return getData;
  };

  const handleClickPage = async (data) => {
    page = data.selected + 1;
    const itemsFromServer = await getItems(page);
    setProducts(itemsFromServer);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="container-fluid">
      <Navbar
        getItems={getItems}
        setProducts={setProducts}
        setRemountComponent={setRemountComponent}
        setSearch={setSearch}
        search={search}
        setIsShow={setIsShow}
        isShow={isShow}
        page={page}
      ></Navbar>
      <div className="result-wrap">
        <h6 className="search-result">{total} results</h6>
      </div>
      <Sort
        getItems={getItems}
        setProducts={setProducts}
        setRemountComponent={setRemountComponent}
        linkRef={linkRef}
        page={page}
      ></Sort>
      <div>
        <br></br>
        <div className="item-name">
          <h4>{productType}</h4>
        </div>
        {products.length > 0 ? (
          <div className="row form-body">
            {products.map((item) => (
              <Products item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="no-cat">
            {typeVal == "" ? (
              <h3>No Products to display</h3>
            ) : (
              <h3>No {typeVal} to display </h3>
            )}
          </div>
        )}
      </div>
      <div key={remountComponent}>
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={3}
          pageRangeDisplayed={4}
          onPageChange={handleClickPage}
          containerClassName="pagination"
          pageLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          activeLinkClassName="active"
        />
      </div>
    </div>
  );
}

export default CatalogContent;
