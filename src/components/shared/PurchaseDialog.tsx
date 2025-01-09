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
        title: t('domain.purchase.error'),
        description: t('domain.purchase.domain_no_owner'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Save offer to database
      const { error: offerError } = await supabase
        .from('domain_offers')
        .insert({
          domain_id: domain.id,
          seller_id: domain.owner_id,
          amount: offerData.amount,
          message: offerData.message
        });

      if (offerError) throw offerError;

      // Send notification email
      const { error: notificationError } = await supabase.functions.invoke('send-offer-notification', {
        body: {
          domainName: domain.name,
          amount: offerData.amount,
          buyerEmail: offerData.email,
          buyerPhone: offerData.phone,
          message: offerData.message
        }
      });

      if (notificationError) throw notificationError;

      toast({
        title: t('domain.purchase.offer_submitted'),
        description: t('domain.purchase.offer_success_message'),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: t('domain.purchase.offer_error'),
        description: t('domain.purchase.offer_error_message'),
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
              className="mb-4 text-white hover:text-white/90 hover:bg-white/10"
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
              onClick={handleBack}
              className="mb-4 text-white hover:text-white/90 hover:bg-white/10"
            >
              ← {t('domain.purchase.back')}
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setMode('payment')}
              >
                {t('domain.purchase.buy_now')}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/10"
                onClick={() => setMode('offer')}
              >
                {t('domain.purchase.make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-800/50 rounded-xl border border-white/10">
              <ShieldCheck className="h-6 w-6 text-blue-300 mt-1" />
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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-black border border-white/20 p-0 overflow-hidden">
        <PurchaseHeader domainName={domain.name} />
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;