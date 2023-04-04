import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import GenderSect from "../components/genderSect";

function CatalogSelect() {
  let cateVal = useLocation().state;
  console.log(cateVal);

  cateVal != null || cateVal == ""
    ? (cateVal = cateVal.category)
    : (cateVal = "");
  return (
    <>
      {cateVal != "" ? (
        <GenderSect gender={cateVal}></GenderSect>
      ) : (
        <Navigate to="/"></Navigate>
      )}
    </>
  );
}

export default CatalogSelect;
