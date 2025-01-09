import { CreditCard } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import PayPalButton from '@/components/PayPalButton';

interface PaymentSectionProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  isProcessing?: boolean;
}

export const PaymentSection = ({ amount, onSuccess, isProcessing }: PaymentSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-400" />
        {t('payment_method_label')}
      </h4>
      <div className="grid gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
          <PayPalButton
            amount={amount}
            onSuccess={onSuccess}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};