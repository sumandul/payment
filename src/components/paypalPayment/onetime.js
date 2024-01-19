import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FaXmark } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
const BASE_URL = process.env.REACT_APP_API_URL;

const CheckoutForm = ({ amount, cur, clientSecret, setOncePayment }) => {
  console.log(cur);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const { error } = await stripe.confirmPayPalPayment(clientSecret, {
      return_url: "https://example.com/checkout/complete",
    });
    // console.log(result);

    // if (result.error) {
    //   // Show error to your customer (for example, payment details incomplete)
    //   console.log(result.error.message);
    // } else {
    //   // Your customer will be redirected to your `return_url`. For some payment
    //   // methods like iDEAL, your customer will be redirected to an intermediate
    //   // site first to authorize the payment, then redirected to the `return_url`.
    // }
  };

  return (
    <div className="   flex     z-[1]   w-[50rem] overflow-hidden  rounded-xl">
      <div className=" border-2 basis-[40%] bg-slate-40  bg-blue-100 border-r-2 border-blue-100"></div>
      <div className=" px-8 basis-[60%] py-10">
        <div className=" flex justify-end">
          <FaXmark
            className="  text-2xl cursor-pointer text-blue-500"
            onClick={() => setOncePayment(false)}
          />
        </div>
        <h4 className=" text-black font-semibold  text-lg mb-4">
          Payment Details
        </h4>
        <form onSubmit={handleSubmit}>
          <div className=" flex flex-col gap-8 mt-8 ">
            <div>
              <label className=" font-semibold text-[18px]    text-[#8C9096]   mb-10">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="  w-full   text-black focus:outline-blue-600 bg-[#FBFCFD]  border-2 border-slate-200  mt-3  px-3 py-3 rounded-[10px]"
              />
            </div>
            <div>
              <label className=" font-semibold  text-[18px]  text-[#8C9096]  mb-10">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="  w-full   text-black bg-[#FBFCFD] focus:outline-[#0057B7] border-2 border-slate-200  mt-3  px-3 py-3 rounded-[10px]"
              />
            </div>
            <div className=" border-2 border-slate-200  focus:outline-blue-600 rounded-[10px] px-3 py-4">
              <PaymentElement />
            </div>
            <div>
              <button
                className=" bg-blue-600  w-full py-3 rounded-xl"
                disabled={!stripe}
              >
                Donate {amount}{" "}
                {loading && (
                  <ClipLoader
                    loading={loading}
                    // cssOverride={override}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
              </button>
            </div>{" "}
            {/* Show error message to your customers */}
            {/* {errorMessage && (
              <div className=" text-red-500">{errorMessage}</div>
            )} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
