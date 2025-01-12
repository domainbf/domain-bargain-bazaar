import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PaymentSection } from './purchase/PaymentSection';
import { OfferForm } from './purchase/OfferForm';
import { PurchaseHeader } from './purchase/PurchaseHeader';
import { PriceDisplay } from './purchase/PriceDisplay';
import { Domain } from '@/types/domain';

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
  const [mode, setMode] = useState<'info' | 'payment' | 'offer'>('info');

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', [
          'purchase_dialog_title',
          'purchase_dialog_description',
          'purchase_dialog_price_label',
          'purchase_dialog_security_message',
          'purchase_dialog_payment_title'
        ]);
      
      if (error) throw error;
      return Object.fromEntries(data.map(item => [item.key, item.value]));
    }
  });

  if (!domain) return null;

  const renderContent = () => {
    switch (mode) {
      case 'payment':
        return (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <PaymentSection
              amount={domain.price}
              onSuccess={onSuccess}
              isProcessing={isProcessing}
            />
          </div>
        );
      case 'offer':
        return (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <OfferForm
              domain={domain}
              onClose={() => onOpenChange(false)}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <PriceDisplay price={domain.price} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                onClick={() => setMode('payment')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                立即购买
              </Button>
              <Button 
                variant="outline"
                className="border-gray-700 text-gray-200 hover:bg-gray-800/50"
                onClick={() => setMode('offer')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                我要出价
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-500/20">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-white">
                    安全交易保障
                  </p>
                  <p className="text-sm text-gray-300">
                    {siteSettings?.purchase_dialog_security_message || 
                      "支付完成后，域名将立即转入您的账户。我们提供安全的支付环境和完整的购买保障。"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-white">
                    即时交付
                  </p>
                  <p className="text-sm text-gray-300">
                    支付成功后，域名将立即转入您的账户，无需等待
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-black border border-white/10 p-0 overflow-hidden">
        <PurchaseHeader 
          title={siteSettings?.purchase_dialog_title || "购买域名"}
          description={siteSettings?.purchase_dialog_description || "您正在购买域名:"}
          domainName={domain.name}
        />
        <div className="p-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;