import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from '@/lib/supabase';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  disabled?: boolean;
}

const PayPalButton = ({ amount, onSuccess, disabled }: PayPalButtonProps) => {
  return (
    <PayPalScriptProvider options={{ 
      clientId: "AQrywMhGpFohZ3lS9GL7iGM1OtZeW3e5cyh541G3_3qzi2-WkBOv2Lo-UCc62ij3ccjMtGxYPY_GDSBl",
      currency: "USD",
      intent: "capture"
    }}>
      <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={async () => {
            const { data, error } = await supabase.functions.invoke('create-paypal-order', {
              body: { amount }
            });

            if (error) throw error;
            return data.id;
          }}
          onApprove={async (data) => {
            const { error } = await supabase.functions.invoke('capture-paypal-order', {
              body: { orderID: data.orderID }
            });

            if (error) {
              console.error('Payment capture failed:', error);
              return;
            }

            console.log("Payment successful");
            onSuccess(data.orderID);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;