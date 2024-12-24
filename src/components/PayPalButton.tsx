import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PayPalButtonProps {
  amount: number;
  domainId: string;
  onSuccess?: () => void;
}

const PayPalButton = ({ amount, domainId, onSuccess }: PayPalButtonProps) => {
  const { toast } = useToast();

  const createOrder = async () => {
    // Create a PayPal order
    const response = await fetch("/api/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
      }),
    });
    
    const order = await response.json();
    return order.id;
  };

  const onApprove = async (data: any) => {
    try {
      // Capture the PayPal order
      const response = await fetch("/api/capture-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const orderData = await response.json();
      
      if (orderData.id) {
        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            domain_id: domainId,
            amount: amount,
            payment_method: 'paypal',
            payment_id: orderData.id,
            status: 'completed'
          });

        if (transactionError) throw transactionError;

        // Update domain status
        const { error: domainError } = await supabase
          .from('domains')
          .update({ status: 'sold' })
          .eq('id', domainId);

        if (domainError) throw domainError;

        toast({
          title: "支付成功",
          description: "您的域名购买已完成",
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error('PayPal transaction error:', error);
      toast({
        title: "支付错误",
        description: "处理您的付款时出现错误",
        variant: "destructive",
      });
    }
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: "USD"
    }}>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;