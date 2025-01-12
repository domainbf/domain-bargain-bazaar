import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="mb-2 text-sm font-medium text-gray-300">
        域名价格
      </div>
      <div className="flex items-baseline gap-2">
        <DollarSign className="h-6 w-6 text-blue-400" />
        <span className="text-3xl font-bold text-white">{price.toLocaleString()}</span>
        <span className="text-gray-300">USD</span>
      </div>
    </div>
  );
};