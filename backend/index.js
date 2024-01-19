require("dotenv").config();
const express = require("express");
const app = express();
var http = require("http").Server(app);
const paymentRoute = require("./routes/paymentRoute");
var cors = require("cors");
console.log(process.env.PORT);

var sendEmail = require("./service/sendEmail");
app.use(cors());
const stripe = require("stripe")(process.env.END_SECKRET_KEY);
const endpointSecret = process.env.END_SECKRET_KEY;
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      switch (event.type) {
        case "charge.succeeded":
          const paymenSucceeded = event.data.object;
          if (paymenSucceeded.billing_details.email) {
            sendEmail(
              paymenSucceeded.billing_details.email,
              paymenSucceeded.receipt_url
            );
          } else {
            sendEmail(
              paymenSucceeded.payment_method_details.paypal.payer_email,
              paymenSucceeded.receipt_url
            );
          }
          break;
        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          console.log(invoice);

          const hello = await sendEmail(
            invoice.customer_email,
            invoice.hosted_invoice_url
          );
          break;
        case "mandate.updated":
          const mandate = event.data.object;
          console.log(mandate);

          // const hello = await sendEmail(
          //   invoice.customer_email,
          //   invoice.hosted_invoice_url
          // );
          break;
        case "customer.subscription.updated":
          const cus = event.data.object;
          console.log(cus, "fgfgfgf");

          // const hello = await sendEmail(
          //   invoice.customer_email,
          //   invoice.hosted_invoice_url
          // );
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    } catch (err) {
      console.log(err, "error");
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  }
);

app.use("/", paymentRoute);

http.listen(process.env.PORT, function () {
  console.log("Server is running");
});
