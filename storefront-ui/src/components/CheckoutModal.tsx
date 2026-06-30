import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard, Truck } from "lucide-react";

import { loadStripe } from "@stripe/stripe-js/pure";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { checkoutOrder } from "../services/api";


// This is Stripe's official public test key. It is safe to expose in the frontend.
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((state: any) => state.cart || state.items || []);
  const clearCart = useCartStore((state: any) => state.clearCart);
  const token = useAuthStore((state: any) => state.token);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"STRIPE" | "COD">("STRIPE");

  // Shipping Form State
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const totalAmount = (Array.isArray(cart) ? cart : []).reduce(
    (total: number, item: any) => total + (item?.price || 0) * (item?.quantity || 1), 
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to checkout.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Send the order details to our Java backend
      const orderPayload = {
        userId: "user-123", 
        userEmail: "customer@dropforge.com",
        shippingAddress: address,
        city: city,
        postalCode: postalCode,
        paymentMethod: method,
        totalAmount: totalAmount,
      };

      const response = await checkoutOrder(orderPayload, token);

      // 2. Handle Stripe specific logic
      if (method === "STRIPE" && response.clientSecret) {
        if (!stripe || !elements) throw new Error("Stripe is not loaded");
        
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found");

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          response.clientSecret,
          { payment_method: { card: cardElement } }
        );

        if (stripeError) {
          throw new Error(stripeError.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          console.log("Payment Succeeded!");
        }
      }

      // 3. Cleanup on success (Both COD and Stripe)
      clearCart();
      onSuccess();
      alert(`Order placed successfully using ${method}!`);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-zinc-900 border-b pb-2">Shipping Details</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">Postal Code</Label>
            <Input id="zip" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-zinc-900 border-b pb-2">Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMethod("STRIPE")}
            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
              method === "STRIPE" ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <CreditCard className={`h-6 w-6 ${method === "STRIPE" ? "text-zinc-900" : "text-zinc-400"}`} />
            <span className="text-sm font-medium">Credit Card</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMethod("COD")}
            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
              method === "COD" ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <Truck className={`h-6 w-6 ${method === "COD" ? "text-zinc-900" : "text-zinc-400"}`} />
            <span className="text-sm font-medium">Cash on Delivery</span>
          </button>
        </div>

        {method === "STRIPE" && (
          <div className="p-4 border border-zinc-200 rounded-xl bg-white mt-4 shadow-sm">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                },
              }} 
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full text-lg h-12" disabled={loading || cart.length === 0}>
        {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export function CheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-6" size="lg" disabled={!isAuthenticated}>
          {isAuthenticated ? "Secure Checkout" : "Login to Checkout"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete your order</DialogTitle>
        </DialogHeader>
        
        {/* We must wrap the form in the Elements provider so it has access to Stripe context */}
        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={() => setIsOpen(false)} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}