import { DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PriceDisplayProps {
  price: number;
}

export const PriceDisplay = ({ price }: PriceDisplayProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-300/20 shadow-lg backdrop-blur-sm">
      <div className="space-y-1">
        <p className="text-purple-200 font-medium">{t('purchase_price_label')}</p>
        <div className="flex items-baseline">
          <DollarSign className="h-8 w-8 text-purple-300 mr-1" />
          <span className="text-4xl font-bold text-white">
            {price.toLocaleString()}
          </span>
          <span className="ml-2 text-purple-200 text-lg">USD</span>
        </div>
      </div>
    </div>
  );
};