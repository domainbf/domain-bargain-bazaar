import React from 'react';

interface PurchaseHeaderProps {
  domainName: string;
}

export const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({ domainName }) => {
  return (
    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
      <h2 className="text-xl font-semibold text-white">
        购买域名
      </h2>
      <p className="text-white/80 text-lg mt-1">
        {domainName}
      </p>
    </div>
  );
};