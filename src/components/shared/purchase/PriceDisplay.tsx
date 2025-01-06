import { DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PriceDisplayProps {
  price: number;
}

export const PriceDisplay = ({ price }: PriceDisplayProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm">
      <div className="space-y-1">
        <p className="text-gray-600 font-medium">{t('purchase_price_label')}</p>
        <div className="flex items-baseline">
          <DollarSign className="h-8 w-8 text-purple-600 mr-1" />
          <span className="text-4xl font-bold text-gray-900">
            {price.toLocaleString()}
          </span>
          <span className="ml-2 text-gray-500 text-lg">USD</span>
        </div>
      </div>
    </div>
  );
};