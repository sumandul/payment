import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";

const Bank = ({ setBank }) => {
  return (
    <div className="   flex     z-[1]   w-[50rem] overflow-hidden  rounded-xl">
      <div className=" border-2 basis-[40%] bg-slate-40  bg-blue-100 border-r-2 border-blue-100"></div>
      <div className=" px-8 basis-[60%] py-10">
        <div className=" flex justify-between items-center">
          <h4 className=" text-black font-semibold  text-lg mb-4">
            Bank Details
          </h4>{" "}
          <div className=" flex justify-end">
            <FaXmark
              className="  text-2xl cursor-pointer text-blue-500"
              onClick={() => setBank(false)}
            />
          </div>
        </div>

        <div className=" flex flex-col gap-8 mt-8 ">
          <div>
            <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
              Benfeifiar:
            </label>
            <div className=" text-black font-semibold mt-2">
              FUNDATIA INTUKROM
            </div>
          </div>
          <div>
            <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
              Cont RON:
            </label>
            <div className=" text-black font-semibold mt-2">
              RO84 UGBI 0000 0820 2596 1RON
            </div>
          </div>
          <div>
            <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
              Cont EUR:
            </label>
            <div className=" text-black font-semibold mt-2">
              RO77 UGBI 0000 0820 2596 2EUR
            </div>
          </div>
          <div>
            <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
              Cont USD:
            </label>
            <div className=" text-black font-semibold mt-2">
              {" "}
              RO74 UGBI 0000 0820 2596 3USD
            </div>
          </div>

          {/* Show error message to your customers */}
          {/* {errorMessage && <div>{errorMessage}</div>} */}
        </div>
      </div>
    </div>
  );
};

export default Bank;
