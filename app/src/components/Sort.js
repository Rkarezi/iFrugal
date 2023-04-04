import React from "react";
import SortOpt from "./SortOpt";
function Sort(props) {
  let selectArray = [
    { type: "brand", name: "Brand [A-Z]", order: "asc", title: "brand" },
    { type: "brand1", name: "Brand [Z-A]", order: "desc", title: "brand" },
    {
      type: "priceFL",
      name: "Price [Low-High]",
      order: "asc",
      title: "priceFL",
    },
    { type: "title", name: "Name [A-Z]", order: "asc", title: "title" },
    { type: "title1", name: "Name [Z-A]", order: "desc", title: "title" },
    { type: "Popular", name: "Popular", order: "asc", title: "Popular" },
  ];
  const handleSort = async () => {
    let focusedOrder = document.activeElement.value;
    let focused = document.activeElement.title;
    if (focused != "") {
      props.linkRef.current = `&_sort=${focused}&_order=${focusedOrder}`;
      const itemsFromServer = await props.getItems(props.page);
      props.setProducts(itemsFromServer);
    }
    props.setRemountComponent(Math.random());
  };

  return (
    <div className="select sort-container" tabIndex="1" onClick={handleSort}>
      {selectArray.map((option) => {
        return (
          <SortOpt
            type={option.type}
            name={option.name}
            order={option.order}
            title={option.title}
          />
        );
      })}
    </div>
  );
}

export default Sort;
