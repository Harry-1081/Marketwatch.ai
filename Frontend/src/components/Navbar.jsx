import React, { useState } from "react";
import ReorderIcon from "@material-ui/icons/Reorder";
import WatsonXLogo from "../assets/watsonx_logo_wbg.png";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  // const toggleNavbar = () => {
  //   setOpenLinks(!openLinks);
  // };

  return (
    <div className="w-[100%] h-[8vh] bg-[#d5e1ffa9] flex items-center justify-between rounded-lg m-2">
      <div className="flex items-center h-full pl-8">
        <img src={WatsonXLogo} className="w-[140px] rounded-lg" />
      </div>
      <div className="flex items-center justify-end h-full pr-8">
        <a href="/home" className="text-black no-underline m-5 text-[24px] font-semibold">Home</a>
        <a href="/about" className="text-black no-underline m-5 text-[24px] font-semibold">About Us</a>
        <a href="/query" className="text-black no-underline m-5 text-[24px] font-semibold">Marketwatch.ai</a>
        {/* <button className="bg-transparent border-none text-white cursor-pointer md:hidden">
          <ReorderIcon className="text-[40px]" />
        </button> */}
      </div>
      {openLinks && (
        <div className="flex flex-col items-start ml-8 md:hidden">
          <a href="/home" className="text-black no-underline m-5 text-[18px]">Home</a>
          <a href="/about" className="text-black no-underline m-5 text-[18px]">About Us</a>
          <a href="/query" className="text-black no-underline m-5 text-[18px]">Marketwatch.ai</a>
        </div>
      )}
    </div>
  );
}

export default Navbar;
