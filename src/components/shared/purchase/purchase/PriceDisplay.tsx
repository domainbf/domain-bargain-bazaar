import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-white/20">
      <div className="text-sm text-gray-300 mb-2">价格</div>
      <div className="text-3xl font-bold text-white">
        {formatCurrency(price)}
      </div>
    </div>
  );
};