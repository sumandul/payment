import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Navigate, useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
const BASE_URL = process.env.REACT_APP_API_URL;

const CheckoutForm = ({
  amount,
  cur,

  setPayPalONes,
  setCard,
}) => {
  console.log(cur);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  let [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pay = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement("card"),
    });
    // const dd = await stripe.createPaymentMethod.
    const ohh = await fetch(`${BASE_URL}/get`, {
      method: "GET",
    });
    const ff = await ohh.json();
    const dd = await fetch(`${BASE_URL}/create-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type as needed
      },
      body: JSON.stringify({
        id: ff.data[0].id,
        email,
        cur,
        amount,
        name,
        payment_method: pay.paymentMethod.id,
      }),
    });
    const ggg = await dd.json();
    console.log(ggg);
    // We don't want to let default form submission happen here,
    // which would refresh the page.

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // const ssss = await stripe.confirmPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement("card"),
    //     billing_details: {
    //       name: name,
    //     },
    //   },
    // });
    // console.log(ssss);
    if (ggg.subscriptionId) {
      navigate("/success");
    }
  };

  return (
    <div className="   flex     z-[1]   w-[50rem] overflow-hidden  rounded-xl">
      <div className=" border-2 basis-[40%] bg-slate-40  bg-blue-100 border-r-2 border-blue-100"></div>
      <div className=" px-8 basis-[60%] py-10">
        <div className=" flex justify-end">
          <FaXmark
            className="  text-2xl cursor-pointer text-blue-500"
            onClick={() => setCard(false)}
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
              <CardElement />
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
            {/* {errorMessage && <div>{errorMessage}</div>} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
