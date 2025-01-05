import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, DollarSign, ShieldCheck, CreditCard, ArrowRight, Check } from 'lucide-react';
import PayPalButton from '../PayPalButton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

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
  const { t } = useTranslation();

  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 bg-gradient-to-br from-slate-50 to-white overflow-hidden rounded-xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <DialogHeader className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-8 w-8 text-blue-200" />
                <span className="text-sm font-medium text-blue-200">{t('purchase_dialog_title')}</span>
              </div>
              <DialogTitle className="text-4xl font-bold tracking-tight mb-2">
                {domain.name}
              </DialogTitle>
              <p className="text-xl text-blue-100 font-medium">
                {t('secure_your_domain')}
              </p>
            </motion.div>
          </DialogHeader>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Price Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <p className="text-slate-600 font-medium">{t('purchase_price_label')}</p>
              <div className="flex items-baseline">
                <DollarSign className="h-8 w-8 text-green-600 mr-1" />
                <span className="text-4xl font-bold text-slate-900">{domain.price.toLocaleString()}</span>
                <span className="ml-2 text-slate-500 text-lg">USD</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>{t('buy_now_button')}</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>

          {/* Security Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100"
          >
            <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
            <div className="space-y-1">
              <p className="font-semibold text-green-800">{t('secure_transaction')}</p>
              <p className="text-green-700 text-sm">
                {t('purchase_security_message')}
              </p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">{t('instant_transfer')}</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">{t('money_back_guarantee')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-slate-800">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">{t('payment_method_label')}</h4>
            </div>
            
            <div className={cn(
              "bg-white rounded-xl border border-slate-200 p-6 shadow-sm",
              isProcessing && "opacity-50 pointer-events-none"
            )}>
              <PayPalButton
                amount={domain.price}
                onSuccess={onSuccess}
                disabled={isProcessing}
              />
            </div>
          </motion.div>

          {/* Terms Notice */}
          <p className="text-sm text-slate-500 text-center">
            {t('terms_notice')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;