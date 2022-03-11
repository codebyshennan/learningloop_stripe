const express = require("express");
const app = express();
const path = require('path')
const cors = require('cors');


require('dotenv').config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// app.use(express.static("public"));
app.use(cors());
app.use(express.static(path.join(__dirname, './build')))
app.use(express.json());
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build'))
})

app.post("/create-payment-intent", async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "sgd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(process.env.PORT || 4242, () => console.log('Node server listening on port 4242!'));