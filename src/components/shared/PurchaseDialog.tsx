
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
              className="mb-4 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
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
              className="mb-4 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
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
          <div className="p-8 space-y-6 bg-gray-900">
            <PriceDisplay price={domain.price} />
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={() => setMode('payment')}
              >
                {t('domain.purchase.buy_now')}
              </Button>
              <Button 
                className="flex-1 bg-slate-200 text-slate-900 hover:bg-white font-medium"
                onClick={() => setMode('offer')}
              >
                {t('domain.purchase.make_offer')}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-800/50 rounded-xl border border-white/10">
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

            {/* PayPal payment button with improved contrast */}
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
              <Button
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold flex items-center justify-center"
                onClick={() => setMode('payment')}
              >
                <svg className="h-5 w-20" viewBox="0 0 101 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.976 9.496h-5.865c-.4 0-.8.32-.864.8l-2.55 16.13c-.033.287.16.543.448.575h2.688c.4 0 .8-.32.864-.8l.673-4.47c.064-.39.39-.8.864-.8h1.855c4.15 0 6.54-2.08 7.165-6.2.288-1.8.01-3.23-.832-4.22-.928-1.07-2.55-1.6-4.77-1.6zm.737 6.114c-.352 2.208-2.038 2.208-3.68 2.208h-.96l.673-4.262c.032-.255.256-.447.512-.447h.416c1.12 0 2.176 0 2.72.67.352.39.448.99.32 1.83zm17.243-6.114h-2.687c-.256 0-.48.192-.544.447l-3.2 20.255c-.032.287.16.543.448.575h2.464c.4 0 .8-.32.864-.8l.832-5.268c.064-.39.39-.8.864-.8h1.855c4.15 0 6.54-2.08 7.165-6.2.288-1.8.01-3.23-.832-4.22-.928-1.07-2.55-1.6-4.77-1.6zm.737 6.114c-.352 2.208-2.038 2.208-3.68 2.208h-.933l.673-4.262c.032-.255.256-.447.512-.447h.416c1.12 0 2.176 0 2.72.67.352.39.48.99.32 1.83zM45.6 15.466h-2.72c-.256 0-.48.192-.512.447l-.128.83-.192-.287c-.608-.9-1.952-1.198-3.296-1.198-3.072 0-5.7 2.4-6.22 5.79-.256 1.67.096 3.29 1.024 4.406.832 1.03 2.08 1.45 3.52 1.45 2.496 0 3.872-1.64 3.872-1.64l-.128.8c-.032.3.16.55.448.55h2.432c.4 0 .8-.32.864-.8l1.6-10.27c.064-.25-.16-.53-.448-.53zm-3.775 5.855c-.256 1.6-1.536 2.72-3.168 2.72-.8 0-1.472-.27-1.856-.75-.384-.5-.544-1.23-.416-2.01.224-1.57 1.536-2.68 3.136-2.68.768 0 1.44.27 1.824.75.448.51.608 1.23.48 2zm17.12-11.874h-2.72c-.32 0-.608.19-.8.48l-4.573 6.94-1.92-6.622c-.128-.39-.48-.67-.896-.67h-2.656c-.32 0-.544.31-.448.7l3.615 10.97-3.37 4.88c-.258.39 0 .93.43.93h2.72c.32 0 .61-.19.8-.48l10.85-16.13c.25-.35 0-.9-.43-.9z" fill="#253B80"/>
                  <path d="M78.24 9.496h-5.88c-.4 0-.8.32-.864.8l-2.55 16.13c-.033.287.16.543.448.575h3.005c.256 0 .48-.19.544-.447l.704-4.47c.064-.39.39-.8.864-.8h1.855c4.15 0 6.54-2.08 7.165-6.2.288-1.8.01-3.23-.832-4.22-.93-1.07-2.55-1.6-4.77-1.6zm.736 6.114c-.352 2.208-2.038 2.208-3.68 2.208h-.96l.673-4.262c.032-.255.256-.447.512-.447h.416c1.12 0 2.176 0 2.72.67.352.39.448.99.32 1.83zm17.243-6.114h-2.687c-.256 0-.48.192-.544.447l-3.2 20.255c-.032.287.16.543.448.575h2.464c.256 0 .48-.19.544-.447l3.2-20.255c.063-.287-.16-.543-.448-.543m6.44 5.97h-2.72c-.256 0-.48.192-.512.447l-.128.83-.192-.287c-.608-.9-1.952-1.198-3.296-1.198-3.072 0-5.7 2.4-6.22 5.79-.256 1.67.096 3.29 1.024 4.406.832 1.03 2.08 1.45 3.52 1.45 2.496 0 3.872-1.64 3.872-1.64l-.128.8c-.032.3.16.55.448.55h2.432c.4 0 .8-.32.864-.8l1.6-10.27c.064-.25-.16-.53-.448-.53zm-3.775 5.855c-.256 1.6-1.536 2.72-3.168 2.72-.8 0-1.472-.27-1.856-.75-.384-.5-.544-1.23-.416-2.01.224-1.57 1.536-2.68 3.136-2.68.768 0 1.44.27 1.824.75.416.51.608 1.23.48 2z" fill="#179BD7"/>
                </svg>
              </Button>
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
