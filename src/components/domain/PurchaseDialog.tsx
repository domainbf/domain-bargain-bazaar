import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Globe, DollarSign, ShieldCheck } from 'lucide-react';
import PayPalButton from '../PayPalButton';

interface Domain {
  id: string;
  name: string;
  price: number;
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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            购买域名
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            您正在购买域名: <span className="font-semibold text-blue-600">{domain.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">域名价格</span>
              <div className="flex items-center text-blue-600">
                <DollarSign className="h-5 w-5 mr-1" />
                <span className="text-2xl font-bold">{domain.price}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <p>
                支付完成后，域名将立即转入您的账户。我们提供安全的支付环境和完整的购买保障。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">选择支付方式</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
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