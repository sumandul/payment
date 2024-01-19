import { useCallback, useEffect, useState } from "react";
import Modal from "../popupmodal/Modal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { OnetimePayment, RecurringPayment } from "../carrdPayment";
import Bank from "../../components/bank";
import { OnetimePaymentPaypal, RecurringPaymentPaypal } from "../paypalPayment";
import { Link } from "react-router-dom";
const stripePromise = loadStripe(
  "pk_test_51O4ggIDlT63GdzzTUcyt0vGUOR6DAHLkG2MM95squ2tRwJLhp4QUlNKXUTdIv6pZN9aDiipL7SHmMXdhuIEoLvU000y2aJvAv3"
);

const BASE_URL = process.env.REACT_APP_API_URL;

function PaymentForm() {
  const [tab, setTab] = useState("once");
  const [tabOne, setTabONe] = useState(false);
  const [paypalOne, setPayPalONe] = useState(false);
  const [paypalOnes, setPayPalONes] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [errors, setErrors] = useState();
  const [method, setMethod] = useState("card");
  const [oncePayment, setOncePayment] = useState(false);
  const [userPayment, setUserPayment] = useState({
    amount: "",
    cur: "",
  });
  const [card, setCard] = useState(false);
  const [paypal, setPaypal] = useState(false);
  const [bank, setBank] = useState(false);
  const [client, setCLient] = useState("");
  const handleChange = (e) => {
    setUserPayment({ ...userPayment, [e.target.name]: e.target.value });
  };
  const create = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Adjust the content type as needed
        },
        body: JSON.stringify({
          amount: userPayment.amount,
          currency: userPayment.cur,
          payment_method_types: [`${method}`],
        }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userPayment.amount, tab, tabOne);
  // if (!userPayment.amount && !userPayment.cur) {
  //   setErrors({ ...errors, amount: true, cur: true });
  // }

  const handlePayment = async () => {
    if (method !== "bank") {
      if (!userPayment.amount && !userPayment.cur) {
        return setErrors({ ...errors, amount: true, cur: true });
      }
    }

    if (method === "card" && tab == "once") {
      // if (!userPayment.amount && !userPayment.cur)
      //   return setErrors("Fill is required");
      const d = await create();
      if (d.success) {
        setTabONe(true);
        setCLient(d);
      } else {
        setErrors(d.msg);
      }
      setUserPayment({ amount: "", cur: "" });
    } else if (method === "card" && tab == "monthly") {
      const d = await create();
      setCLient(d);
      setCard(true);
    }
    if (
      method === "paypal" &&
      tab === "once" &&
      userPayment.amount &&
      userPayment.cur
    ) {
      const d = await create();
      setCLient(d);
      setPayPalONe(true);
    } else if (
      method === "paypal" &&
      tab === "monthly" &&
      userPayment.amount &&
      userPayment.cur
    ) {
      const d = await create();
      setCLient(d);
      setRecurring(true);
    }
    if (method === "bank") {
      setBank(true);
    }
  };
  const options = {
    // passing the client secret obtained in step 3
    clientSecret: client.client_secret && client.client_secret,

    // Fully customizable with appearance API.
    appearance: {
      theme: "stripe",
      /*...*/
    },
  };

  // useEffect(() => {
  //   // Show error message

  //   // Set a timeout to close the error message after 3000 milliseconds (3 seconds)
  //   const timeoutId = setTimeout(() => {
  //     setErrors({ ...errors, amount: false, cur: false });
  //   }, 2000);

  //   // Cleanup the timeout when the component unmounts
  //   return () => clearTimeout(timeoutId);
  // }, [errors]); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <>
      <Modal isOpen={bank}>
        <Bank setBank={setBank} />
      </Modal>
      <Modal isOpen={tabOne}>
        <Elements stripe={stripePromise}>
          <OnetimePayment
            clientSecret={client.client_secret}
            amount={userPayment.amount}
            setTabONe={setTabONe}
            cur={userPayment.cur}
          />
        </Elements>
      </Modal>

      <Modal isOpen={card}>
        <Elements stripe={stripePromise}>
          <RecurringPayment
            amount={userPayment.amount}
            cur={userPayment.cur}
            setCard={setCard}
          />
        </Elements>
      </Modal>
      <Modal isOpen={paypalOne}>
        <Elements
          stripe={stripePromise}
          options={options}
          clientSecret={client.client_secret}
        >
          <OnetimePaymentPaypal
            amount={userPayment.amount}
            cur={userPayment.cur}
            setOncePayment={setPayPalONe}
            clientSecret={client.client_secret}
          />
        </Elements>
      </Modal>
      <Modal isOpen={recurring}>
        <Elements stripe={stripePromise} options={options}>
          <RecurringPaymentPaypal
            amount={userPayment.amount}
            cur={userPayment.cur}
            clientSecret={client.client_secret}
            pay_method_id={client.payment_method}
            cus_id={client.customer}
            setRecurring={setRecurring}
          />
        </Elements>
      </Modal>

      <div>
        <div
          style={{
            backgroundImage: 'url("./rr.webp")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className=" flex justify-end   min-h-screen items-center"
        >
          <div className="  fixed left-0 right-0   z-[-1] w-full h-full opacity-[0.3]"></div>
          <div className=" mr-20">
            <div
              // style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              className="  flex flex-col gap-8  border-2 border-[#e2e8f0]  bg-[#F1F3F5]   z-[1]   w-[30rem] px-4 py-9 rounded-xl"
            >
              <div>
                <label className=" uppercase font-semibold text-[18px]  text-[#8C9096]  mb-10">
                  Amount Invested
                </label>
                <input
                  name="amount"
                  required
                  value={userPayment.amount}
                  onChange={handleChange}
                  className="  w-full bg-[#FBFCFD] focus:outline-[#0057B7] border-2 border-slate-200    mt-3  px-3 py-3 rounded-[10px]"
                />
                {errors && (
                  <p className=" text-red-500 text-sm font-medium mt-1">
                    {errors}
                  </p>
                )}
              </div>
              <div>
                <label className=" uppercase  text-[18px] font-semibold   text-[#8C9096]   mb-10">
                  Choose Currency
                </label>
                <select
                  name="cur"
                  required
                  onChange={handleChange}
                  className=" w-full bg-[#FBFCFD] text-[#99AFCB]  border-2 border-slate-200 focus:outline-[#0057B7]   mt-3  px-3 py-4 rounded-[10px]"
                >
                  <option value="lei" className=" " defaultValue={""}>
                    Select currency
                  </option>
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </select>
                {/* <p
                  className={`${
                    errors.cur ? "block" : " hidden"
                  } text-red-500  text-sm font-medium mt-1`}
                >
                  Chooose currency
                </p> */}
              </div>

              <div>
                <label className=" capitalize  text-[#8C9096] font-semibold text-[18px]    mb-2">
                  FREQUENCY
                </label>
                <div className=" flex mt-3   rounded-[10px] items-center   ">
                  <button
                    onClick={() => setTab("once")}
                    className={` ${
                      tab === "once"
                        ? " border-2  border-[#0057B7]  text-black outline-none"
                        : "  border-2 border-r-0  rounded-tr-none rounded-br-none"
                    } w-full text-[14px] hover:bg-white   font-semibold text-[#99AFCB]  rounded-[10px] py-3`}
                  >
                    once
                  </button>
                  <button
                    onClick={() => setTab("monthly")}
                    className={`  ${
                      tab === "monthly"
                        ? "  border-2 border-[#0057B7]"
                        : " border-2 border-l-0  rounded-tl-none rounded-bl-none "
                    } w-full   rounded-[10px] py-3`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div>
                <label className="  uppercase text-[18px] font-semibold   text-[#8C9096]   mb-12">
                  Payment method
                </label>
                <div className=" flex mt-2  rounded-[10px] border-slate-200 border-2  items-center  ">
                  <button
                    onClick={() => setMethod("card")}
                    className={` ${
                      method === "card"
                        ? " border-2  text-black  border-[#0057B7] "
                        : "text-[#929296]"
                    } w-full flex justify-center hover:bg-white  items-center rounded-[10px] py-3`}
                  >
                    <div className=" flex justify-center items-center flex-col">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-credit-card"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                      card
                    </div>
                  </button>
                  <button
                    onClick={() => setMethod("paypal")}
                    className={`  ${
                      method === "paypal"
                        ? " border-2  border-[#0057B7] "
                        : "text-[#929296]"
                    } w-full flex justify-center items-center rounded-[10px] py-3 `}
                  >
                    <div className=" flex justify-center items-center flex-col">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 384 512"
                        class="p-[1px]"
                        height="22"
                        width="22"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"></path>
                      </svg>
                      Paypal
                    </div>
                  </button>
                  <button
                    onClick={() => setMethod("bank")}
                    className={`  ${
                      method === "bank"
                        ? " border-2  border-[#0057B7] "
                        : "text-[#929296]"
                    } w-full flex  justify-center items-center rounded-[10px] py-3 `}
                  >
                    <div className=" flex justify-center items-center flex-col">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-landmark"
                      >
                        <line x1="3" x2="21" y1="22" y2="22"></line>
                        <line x1="6" x2="6" y1="18" y2="11"></line>
                        <line x1="10" x2="10" y1="18" y2="11"></line>
                        <line x1="14" x2="14" y1="18" y2="11"></line>
                        <line x1="18" x2="18" y1="18" y2="11"></line>
                        <polygon points="12 2 20 7 4 7"></polygon>
                      </svg>
                      Tranfer
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <button
                  onClick={handlePayment}
                  className=" w-full text-center bg-[#0057B7] py-3 rounded text-white  font-semibold text-base  tracking-[0.085rem]  capitalize"
                >
                  Donate Online
                </button>
              </div>
              <div className="  flex text-[#8C9096]  underline justify-center items-center">
                {" "}
                <Link to={"/suscribtion"}>Cancel Suscription?</Link>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentForm;
