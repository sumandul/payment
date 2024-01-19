import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const CancelSubSCRPTIO = () => {
  const [email, setEmail] = useState("");
  const [details, setDetail] = useState({});
  const navigate = useNavigate();
  const handleSearch = async () => {
    const res = await fetch("http://localhost:5000/susbriction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type as needed
      },
      body: JSON.stringify({
        email,
      }),
    });
    const ddoos = await res.json();
    console.log(ddoos);
    setDetail(ddoos.subscriptionDetail);
  };
  const handleCancel = async () => {
    const res = await fetch("http://localhost:5000/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type as needed
      },
      body: JSON.stringify({ id: details.id }),
    });
    const data = await res.json();
    console.log(data);
    if (data.subscription.status === "canceled") {
      navigate("/");
    }
  };
  return (
    <div className=" flex justify-center items-center min-h-screen">
      <div className=" bg-blue-100 border-r-2 border-blue-100 h-80 flex flex-col gap-6 py-4 rounded-md  px-4">
        <div>
          <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
            Enter the Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="  w-full   text-black focus:outline-blue-600 bg-[#FBFCFD]  border-2 border-slate-200  mt-3  px-3 py-3 rounded-[10px]"
          />
        </div>
        <div>
          <button
            onClick={handleSearch}
            className=" w-full bg-blue-500 py-3 rounded-md px-3 text-white"
          >
            Search
          </button>
        </div>
        {details && (
          <div>
            Email:{details?.metadata?.customerEmail}
            <div className=" mt-3">
              {" "}
              <button className=" capitalize bg-green-500 py-3 text-white px-8  rounded-md ">
                active now
              </button>{" "}
              <button
                onClick={handleCancel}
                className=" capitalize  bg-red-500 py-3 text-white px-8  rounded-md "
              >
                Cancel subscription
              </button>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelSubSCRPTIO;
