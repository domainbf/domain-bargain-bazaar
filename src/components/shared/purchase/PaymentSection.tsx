
import React from 'react';
import PayPalButton from '@/components/PayPalButton';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentSectionProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  isProcessing?: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  onSuccess,
  isProcessing = false
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          确认付款
        </h3>
        <p className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          ${amount.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-lg p-5 border border-white/10 shadow-lg">
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-white font-medium mb-3">
            <CreditCard className="h-4 w-4 text-blue-400" />
            选择支付方式
          </h4>
        </div>
        
        <Button 
          className="w-full mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          disabled={isProcessing}
          onClick={() => {/* 处理支付逻辑 */}}
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

        <div className="mt-4 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
          <PayPalButton
            amount={amount}
            onSuccess={onSuccess}
            disabled={isProcessing}
          />
        </div>
      </div>
      
      <p className="text-sm text-blue-300 text-center">
        点击上方按钮完成支付
      </p>
    </div>
  );
};
