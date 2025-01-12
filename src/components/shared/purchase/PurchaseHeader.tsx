import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PurchaseHeaderProps {
  title?: string;
  description?: string;
  domainName: string;
}

export const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({ 
  title = "购买域名", 
  description = "您正在购买域名:",
  domainName 
}) => {
  return (
    <DialogHeader className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
      <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-blue-400" />
        {title}
      </DialogTitle>
      <DialogDescription className="text-gray-300">
        {description}
        <span className="font-semibold text-blue-400 ml-1">{domainName}</span>
      </DialogDescription>
    </DialogHeader>
  );
};