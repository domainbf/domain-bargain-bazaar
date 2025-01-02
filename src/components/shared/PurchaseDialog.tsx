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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
}

interface PurchaseDialogProps {
  domain: Domain | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (paymentId: string) => void;
  isProcessing?: boolean;
}

const PurchaseDialog = ({ 
  domain, 
  onOpenChange, 
  onSuccess,
  isProcessing 
}: PurchaseDialogProps) => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings', 'purchase-dialog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', [
          'purchase_dialog_title',
          'purchase_dialog_description',
          'purchase_security_message'
        ]);
      
      if (error) throw error;
      return Object.fromEntries(data.map(item => [item.key, item.value]));
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-lg border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" />
            {settings?.purchase_dialog_title || "购买域名"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {settings?.purchase_dialog_description || "您正在购买域名:"} 
            <span className="font-semibold text-blue-400 ml-1">{domain.name}</span>
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
              <ShieldCheck className="h-5 w-5 text-green-400 mt-0.5" />
              <p>{settings?.purchase_security_message || 
                "支付完成后，域名将立即转入您的账户。我们提供安全的支付环境和完整的购买保障。"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-white">选择支付方式</h4>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <PayPalButton
                amount={domain.price}
                onSuccess={onSuccess}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;