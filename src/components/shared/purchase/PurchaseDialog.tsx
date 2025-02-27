
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PurchaseHeader } from './PurchaseHeader';
import { PriceDisplay } from './PriceDisplay';
import { PaymentSection } from './PaymentSection';
import { OfferForm } from './OfferForm';
import { Domain } from '@/types/domain';

interface PurchaseDialogProps {
  domain: Domain | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (paymentId: string) => void;
  isProcessing?: boolean;
}

export const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  domain, 
  onOpenChange, 
  onSuccess,
  isProcessing 
}) => {
  const [mode, setMode] = useState<'info' | 'payment' | 'offer'>('info');
  const { t } = useTranslation();

  if (!domain) return null;

  const renderContent = () => {
    switch (mode) {
      case 'payment':
        return (
          <div className="p-8 space-y-6 bg-gradient-to-b from-gray-900 to-slate-900">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-blue-300 hover:text-blue-200 hover:bg-slate-800/70 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('domain.purchase.back')}
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
          <div className="p-8 space-y-6 bg-gradient-to-b from-gray-900 to-slate-900">
            <Button 
              variant="ghost" 
              onClick={() => setMode('info')}
              className="mb-4 text-blue-300 hover:text-blue-200 hover:bg-slate-800/70 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('domain.purchase.back')}
            </Button>
            <OfferForm
              domain={domain}
              onClose={() => onOpenChange(false)}
            />
          </div>
        );
      default:
        return (
          <div className="p-8 space-y-6 bg-gradient-to-b from-gray-900 to-slate-900">
            <PriceDisplay price={domain.price} />
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-900/20"
                onClick={() => setMode('payment')}
              >
                {t('domain.purchase.buy_now')}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMode('offer')}
              >
                {t('domain.purchase.make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-blue-400 mt-1" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  {t('domain.purchase.secure_transaction')}
                </p>
                <p className="text-blue-200">
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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 p-0 overflow-hidden shadow-xl backdrop-blur-lg">
        <PurchaseHeader domainName={domain.name} />
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
