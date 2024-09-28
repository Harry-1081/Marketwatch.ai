import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
    <Navbar/>
     <div className="my-[200px]">
        <div className="overflow-hidden select-none flex gap-16 transform -rotate-1">
          <ul className="list-none flex-shrink-0 min-w-full flex justify-between items-center gap-16 animate-marquee">
            <li><span className="bg-gradient-to-r from-[#cccbcb] via-[#ffda62] to-[#b79f00] bg-clip-text text-transparent font-normal text-[25ch]">Marketwatch.ai</span></li>
          </ul>
          <ul aria-hidden="true" className="list-none flex-shrink-0 min-w-full flex justify-between items-center gap-16 animate-marquee">
            <li><span className="bg-gradient-to-r from-[#cccbcb] via-[#ffda62] to-[#b79f00] bg-clip-text text-transparent font-normal text-[25ch]">Marketwatch.ai</span></li>
          </ul>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Home;
