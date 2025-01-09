import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PurchaseHeader } from './purchase/PurchaseHeader';
import { PriceDisplay } from './purchase/PriceDisplay';
import { PaymentSection } from './purchase/PaymentSection';
import { OfferForm } from './purchase/OfferForm';
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
  const { t } = useTranslation();

  if (!domain) return null;

  const renderContent = () => {
    switch (mode) {
      case 'payment':
        return (
          <div className="p-8 space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-300 hover:text-white hover:bg-white/10"
            >
              ← {t('domain.purchase.back')}
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
          <div className="p-8 space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-300 hover:text-white hover:bg-white/10"
            >
              ← {t('domain.purchase.back')}
            </Button>
            <OfferForm
              domain={domain}
              onClose={() => onOpenChange(false)}
            />
          </div>
        );
      default:
        return (
          <div className="p-8 space-y-6">
            <PriceDisplay price={domain.price} />
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setMode('payment')}
              >
                {t('domain.purchase.buy_now')}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                onClick={() => setMode('offer')}
              >
                {t('domain.purchase.make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-900/80 rounded-xl border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="h-6 w-6 text-blue-400 mt-1" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  {t('domain.purchase.secure_transaction')}
                </p>
                <p className="text-gray-300 text-sm">
                  {t('domain.purchase.protection')}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border border-white/20 p-0 overflow-hidden shadow-2xl">
        <PurchaseHeader domainName={domain.name} />
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;