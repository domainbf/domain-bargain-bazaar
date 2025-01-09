import React from 'react';

interface PurchaseHeaderProps {
  domainName: string;
}

export const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({ domainName }) => {
  return (
    <div className="p-6 border-b border-white/20 bg-gray-800">
      <h2 className="text-xl font-semibold text-white">
        {domainName}
      </h2>
      <p className="text-sm text-gray-300 mt-1">
        购买此域名
      </p>
    </div>
  );
};