import { useTranslation } from '@/hooks/useTranslation';
import { DollarSign } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
}

export const PriceDisplay = ({ price }: PriceDisplayProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <div className="mb-2 text-sm font-medium text-gray-300">
        {t('domain.price')}
      </div>
      <div className="flex items-baseline gap-2">
        <DollarSign className="h-6 w-6 text-blue-400" />
        <span className="text-3xl font-bold text-white">
          {price.toLocaleString()}
        </span>
        <span className="text-gray-300">USD</span>
      </div>
    </div>
  );
};