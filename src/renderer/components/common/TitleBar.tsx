import React from "react";
import "./TitleBar.scss";

function App() {
  return (
    <div
      className="SkyTitleBar"
      style={{ height: process.env.IS_WEB ? "0px" : "40px" }}></div>
  );
}

export default App;
