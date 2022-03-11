import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {
    window
      .fetch("/create-payment-intent", {
        method: "POST"
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  // Open up a toast to a successful payment
  useEffect(()=> {
    if (succeeded) {
      toast.success('Payment succeeded!')
    }
  }, [succeeded])
  
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <> 
    <div
      style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src="/ukraine.png"
        alt="flag"
        height="87"
        width="100" 
      />
    </div>
    <p id='title'><b>Help Ukraine, </b>one coffee at a time.</p>
    <div className="tooltip">
      <h1>$ 5</h1>
      <div className="arrow-down"></div>
    </div>

    <form id="payment-form" onSubmit={handleSubmit}>

      <CardElement 
        id="card-element" 
        options={cardStyle} 
        onChange={handleChange} 
      />

      <button disabled={ processing || disabled || succeeded }>
        <span id="button-text">
        { processing ? (
          <div className="spinner" id="spinner"></div>
        ) : (
          "Pay now"
        )}
        </span>
      </button>

      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}

      {/* Show a success message upon completion */}
      <ToastContainer />
    </form>
  </>
  );
}

export default CheckoutForm