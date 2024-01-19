const nodemailer = require("nodemailer");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createSetupIntent = async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["paypal"],
      payment_method_data: {
        type: "paypal",
      },
    });

    res.status(200).send(setupIntent);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
const createpaypalSubscription = async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 3,
    });

    const price = await stripe.prices.create({
      product: products.data[0].id,
      unit_amount: 100,
      currency: "usd",
      recurring: {
        interval: "month",
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: req.body.cudId,
      default_payment_method: paymentMethod.id,
      items: [
        {
          price: price.id,
        },
      ],
      payment_behavior: "allow_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["paypal"],
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: { customerEmail: req.body.email },
    });
    res.status(200).send(subscription);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const getDonation = async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 3,
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const createIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: req.body.currency,
      payment_method_types: req.body.payment_method_types,
    });

    res.status(200).send(paymentIntent);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
const createSubscription = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
      payment_method: req.body.payment_method,
      invoice_settings: { default_payment_method: req.body.payment_method },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: req.body.cur,
            unit_amount: req.body.amount,
            currency: req.body.cur,
            product: req.body.id,

            recurring: {
              interval: "month",
            },
          },
        },
      ],
      payment_behavior: "allow_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: { customerEmail: req.body.email },
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};
const cancelSub = async (req, res) => {
  console.log(req.body.id, "id");
  try {
    const subscription = await stripe.subscriptions.cancel(req.body.id);
    res.send({
      subscription,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};

const createWeb = async (req, res) => {
  const endpointSecret =
    "whsec_3398375f3d5d8e05ec9cc2a3508f0a8e1b8a423e433f2e2e18ad6503ca450b6c";
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // console.log(req.body);
    // const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded, "hello");
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.log(err, "err");
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event

  // Return a 200 response to acknowledge receipt of the event
  res.send({ message: "ok" });
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
const sub_search = async (req, res) => {
  console.log(req.body.email);
  // Return a 200 response to acknowledge receipt of the event
  try {
    const subscription = await stripe.subscriptions.search({
      query: `status:'active' AND metadata['customerEmail']:'${req.body.email}'`,
    });
    const subscriptionDetail = await stripe.subscriptions.retrieve(
      subscription.data[0].id
    );
    console.log(subscriptionDetail);

    res.send({ subscriptionDetail });
  } catch (error) {
    res.send({ error });
  }
};
const getIntent = async (req, res) => {
  console.log(req.body.email);
  // Return a 200 response to acknowledge receipt of the event
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.body.id);
    console.log(subscriptionDetail);

    res.send({ paymentIntent });
  } catch (error) {
    res.send({ error });
  }
};

module.exports = {
  createIntent,
  createSubscription,
  getDonation,
  createSetupIntent,
  createpaypalSubscription,
  createWeb,
  sub_search,
  cancelSub,
  getIntent,
};
