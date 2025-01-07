import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PurchaseHeader } from './purchase/PurchaseHeader';
import { PriceDisplay } from './purchase/PriceDisplay';
import { PaymentSection } from './purchase/PaymentSection';
import { OfferForm } from './purchase/OfferForm';
import { supabase } from '@/lib/supabase';
import { Domain } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  if (!domain) return null;

  const handleOfferSubmit = async (offerData: {
    amount: number;
    email: string;
    phone: string;
    message: string;
  }) => {
    if (!domain.owner_id) {
      toast({
        title: t('error'),
        description: t('domain_no_owner'),
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: notificationError } = await supabase.functions.invoke('send-offer-notification', {
        body: {
          domainName: domain.name,
          amount: offerData.amount,
          buyerEmail: offerData.email,
          buyerPhone: offerData.phone,
          message: offerData.message,
          ownerEmail: domain.owner_id
        }
      });

      if (notificationError) throw notificationError;
      
      toast({
        title: t('offer_submitted'),
        description: t('offer_success_message'),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: t('error'),
        description: t('offer_error_message'),
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setMode('info');
  };

  const renderContent = () => {
    switch (mode) {
      case 'payment':
        return (
          <div className="p-8 space-y-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-4 text-purple-200 hover:text-purple-100 hover:bg-purple-500/20"
            >
              ← {t('back')}
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
              onClick={handleBack}
              className="mb-4 text-purple-200 hover:text-purple-100 hover:bg-purple-500/20"
            >
              ← {t('back')}
            </Button>
            <OfferForm
              domain={domain}
              onSubmit={handleOfferSubmit}
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setMode('payment')}
              >
                {t('buy_now')}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-purple-300 text-purple-100 hover:bg-purple-500/20 hover:border-purple-200 transition-all duration-300"
                onClick={() => setMode('offer')}
              >
                {t('make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-purple-900/30 rounded-xl border border-purple-300/20 backdrop-blur-sm">
              <ShieldCheck className="h-6 w-6 text-purple-300 mt-1" />
              <div className="space-y-1">
                <p className="font-semibold text-purple-100">
                  {t('secure_transaction')}
                </p>
                <p className="text-purple-200 text-sm">
                  {t('purchase_security_message')}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg border border-purple-300/20 p-0 overflow-hidden shadow-2xl">
        <PurchaseHeader domainName={domain.name} />
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;