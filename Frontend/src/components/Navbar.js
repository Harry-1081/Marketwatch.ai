import React, { useState } from "react";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";
import WatsonXLogo from "../assets/watsonx_logo_wbg.png";


function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={WatsonXLogo}/>
      </div>
      <div className="rightSide">
        <a href="/home" className="button">Home</a>
        <a href="/about" className="button">About Us</a>
        <a href="/query" className="button">Marketwatch.ai</a>
      </div>
    </div>
  );
}

export default Navbar;