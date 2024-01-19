const express = require("express");
const payment_route = express();

const bodyParser = require("body-parser");
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended: false }));

const paymentController = require("../controllers/paymentController");

payment_route.post("/create-intent", paymentController.createIntent);
payment_route.post(
  "/create-subscription",
  paymentController.createSubscription
);
payment_route.get("/get", paymentController.getDonation);
// payment_route.get("/get-payment-method", paymentController.getPaymentMethod);
payment_route.post("/webhooksss", paymentController.createWeb);
payment_route.post("/susbriction", paymentController.sub_search);
payment_route.post("/cancel", paymentController.cancelSub);
payment_route.post(
  "/create-paypal-sub",
  paymentController.createpaypalSubscription
);
payment_route.post("/create", paymentController.createSetupIntent);
// payment_route.post("/send-email", paymentController.sendEmail);
module.exports = payment_route;
