import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    // Run the middleware
  await runMiddleware(req, res, cors)

  console.log("hi")

  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5,
        currency: 'sgd',
        automatic_payment_methods: {
          enabled: true
        }
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}