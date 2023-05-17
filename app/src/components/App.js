import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import CatalogContent from "../pages/CatalogContent";
import CatalogSelect from "../pages/CatalogSelect";
import ScrapeIndex from "../pages/ScrapeIndex";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route
            path="/gender"
            element={<CatalogSelect></CatalogSelect>}
          ></Route>
          <Route
            path="/catalog"
            element={<CatalogContent></CatalogContent>}
          ></Route>
          <Route path="/stores" element={<ScrapeIndex></ScrapeIndex>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
