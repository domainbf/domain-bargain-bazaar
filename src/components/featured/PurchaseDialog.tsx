import React from 'react';
import { Globe, DollarSign, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PayPalButton from '../PayPalButton';

interface Domain {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface PurchaseDialogProps {
  domain: Domain | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PurchaseDialog = ({ domain, onOpenChange, onSuccess }: PurchaseDialogProps) => {
  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-lg border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" />
            购买域名
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            您正在购买域名: <span className="font-semibold text-blue-400">{domain.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 font-medium">域名价格</span>
              <div className="flex items-center text-green-400">
                <DollarSign className="h-5 w-5 mr-1" />
                <span className="text-2xl font-bold">${domain.price}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Tag className="h-5 w-5 text-blue-400 mt-0.5" />
              <p>类别: <span className="font-semibold">{domain.category || '标准'}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-white">选择支付方式</h4>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <PayPalButton
                amount={domain.price}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;