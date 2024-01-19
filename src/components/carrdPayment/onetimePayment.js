import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
const BASE_URL = process.env.REACT_APP_API_URL;
const CheckoutForm = ({ amount, cur, clientSecret, setTabONe }) => {
  console.log(cur);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  let [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const pay = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement("card"),
    });
    if (!stripe || !elements) {
      return;
    }

    console.log(clientSecret);
    // const ssss = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement("card"),
    //     billing_details: {
    //       name: name,
    //       email: email,
    //     },
    //   },
    // });
    // console.log(
    //   ssss.paymentIntent,

    //   "hhjhj"
    // );
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${BASE_URL}/success`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <div className="   flex     z-[1]   w-[50rem] overflow-hidden  rounded-xl">
      <div className=" border-2 basis-[40%] bg-slate-40  bg-blue-100 border-r-2 border-blue-100"></div>
      <div className=" px-8 basis-[60%] py-10">
        <div className=" flex justify-end">
          <FaXmark
            className="  text-2xl cursor-pointer text-blue-500"
            onClick={() => setTabONe(false)}
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
                className=" bg-blue-600 flex items-center justify-center  w-full py-3 rounded-xl"
                disabled={!stripe}
              >
                Donate {amount}{" "}
                {loading && (
                  <>
                    <span>Processing....</span>
                    <ClipLoader
                      loading={loading}
                      // cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </>
                )}
              </button>
            </div>{" "}
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
