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
          <div className="p-8 space-y-6 bg-gray-900">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-200 hover:text-white hover:bg-gray-800"
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
          <div className="p-8 space-y-6 bg-gray-900">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-gray-200 hover:text-white hover:bg-gray-800"
            >
              ← {t('domain.purchase.back')}
            </Button>
            <OfferForm
              domain={domain}
              onClose={() => onOpenChange(false)}
              onSubmit={async (data) => {
                // Handle offer submission
                onOpenChange(false);
              }}
            />
          </div>
        );
      default:
        return (
          <div className="p-8 space-y-6 bg-gray-900">
            <PriceDisplay price={domain.price} />
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setMode('payment')}
              >
                {t('domain.purchase.buy_now')}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-700 text-gray-200 hover:bg-gray-800"
                onClick={() => setMode('offer')}
              >
                {t('domain.purchase.make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <ShieldCheck className="h-6 w-6 text-blue-400 mt-1" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  {t('domain.purchase.secure_transaction')}
                </p>
                <p className="text-gray-300">
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
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 p-0 overflow-hidden">
        <PurchaseHeader domainName={domain.name} />
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;