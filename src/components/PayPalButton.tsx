import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: () => void;
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  const createOrder = () => {
    return fetch("/api/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={(data) => {
        return fetch("/api/capture-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            onSuccess();
          });
      }}
    />
  );
};

export default PayPalButton;