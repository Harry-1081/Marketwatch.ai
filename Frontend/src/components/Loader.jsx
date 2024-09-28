import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <span className="inline-block w-[6px] h-[40px] bg-yellow-600 bg-opacity-50 rounded-lg animate-scale-up4"></span>
      <span className="inline-block w-[6px] h-[70px] bg-yellow-600 bg-opacity-50 rounded-lg mx-[5px] animate-scale-up4 delay-100"></span>
      <span className="inline-block w-[6px] h-[40px] bg-yellow-600 bg-opacity-50 rounded-lg animate-scale-up4 delay-200"></span>
      <style jsx>{`
        @keyframes scale-up4 {
          20% {
            background-color: #FEBF00;
            transform: scaleY(1.5);
          }
          40% {
            transform: scaleY(1);
          }
        }
        .animate-scale-up4 {
          animation: scale-up4 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
