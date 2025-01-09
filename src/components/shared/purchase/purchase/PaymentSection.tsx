import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
      <div className="bg-gray-800/50 p-6 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">支付方式</h3>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            '确认支付'
          )}
        </Button>
      </div>
    </div>
  );
};