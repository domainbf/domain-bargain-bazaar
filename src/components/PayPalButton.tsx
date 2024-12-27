import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: () => void;
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  return (
    <PayPalScriptProvider options={{ 
      clientId: "test", // Replace with your PayPal client ID in production
      currency: "USD",
      intent: "capture"
    }}>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                  currency_code: "USD"
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const order = await actions.order.capture();
            console.log("Payment successful", order);
            onSuccess();
          }
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;