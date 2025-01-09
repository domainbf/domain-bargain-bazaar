import React from 'react';
import PayPalButton from '@/components/PayPalButton';
import { formatCurrency } from '@/lib/utils';

interface PaymentSectionProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  isProcessing?: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  onSuccess,
  isProcessing
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          确认付款
        </h3>
        <p className="text-3xl font-bold text-white">
          {formatCurrency(amount)}
        </p>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <PayPalButton
          amount={amount}
          onSuccess={onSuccess}
          disabled={isProcessing}
        />
      </div>
      
      <p className="text-sm text-gray-400 text-center">
        点击上方按钮完成支付
      </p>
    </div>
  );
};