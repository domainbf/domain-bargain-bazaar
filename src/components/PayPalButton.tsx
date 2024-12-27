import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: () => void;
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  return (
    <PayPalScriptProvider options={{ 
      "client-id": "test", // In production, this should be your PayPal client ID
      currency: "USD"
    }}>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
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