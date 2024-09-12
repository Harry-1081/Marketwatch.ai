import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Button,Stack,Box } from "@mui/material";

function Home() {
  return (
    <div class="container">
    <div class="marquee">
      <ul>
        <li><span class="text">Marketwatch.ai</span></li>
      </ul>
      <ul aria-hidden="true">
        <li>
          <span class="text">Marketwatch.ai</span>
        </li>
      </ul>
      
    </div>
  </div>
  );
}

export default Home;