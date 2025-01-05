import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import PayPalButton from '../PayPalButton';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [showPayment, setShowPayment] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    email: '',
    phone: '',
    message: ''
  });
  const { t } = useTranslation();
  const { toast } = useToast();

  if (!domain) return null;

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically send the offer to your backend
      toast({
        title: "报价已提交",
        description: "我们会尽快与您联系",
      });
      setShowOffer(false);
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const renderMainContent = () => (
    <>
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-purple-200" />
              <span className="text-sm font-medium text-purple-200">
                {t('purchase_dialog_title')}
              </span>
            </div>
            <DialogTitle className="text-4xl font-bold tracking-tight mb-2">
              {domain.name}
            </DialogTitle>
          </motion.div>
        </DialogHeader>
      </div>
      
      <div className="p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm"
        >
          <div className="space-y-1">
            <p className="text-gray-600 font-medium">{t('purchase_price_label')}</p>
            <div className="flex items-baseline">
              <DollarSign className="h-8 w-8 text-purple-600 mr-1" />
              <span className="text-4xl font-bold text-gray-900">
                {domain.price.toLocaleString()}
              </span>
              <span className="ml-2 text-gray-500 text-lg">USD</span>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowPayment(true)}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {t('buy_now_button')}
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => setShowOffer(true)}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            立即报价
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100"
        >
          <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
          <div className="space-y-1">
            <p className="font-semibold text-green-800">
              {t('secure_transaction')}
            </p>
            <p className="text-green-700 text-sm">
              {t('purchase_security_message')}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );

  const renderPaymentContent = () => (
    <div className="p-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => setShowPayment(false)}
        className="mb-4"
      >
        ← 返回
      </Button>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          选择支付方式
        </h3>
        <div className={cn(
          "bg-white rounded-xl border border-purple-100 p-6 shadow-sm",
          isProcessing && "opacity-50 pointer-events-none"
        )}>
          <PayPalButton
            amount={domain.price}
            onSuccess={onSuccess}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );

  const renderOfferContent = () => (
    <div className="p-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => setShowOffer(false)}
        className="mb-4"
      >
        ← 返回
      </Button>
      
      <form onSubmit={handleOfferSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            报价金额 (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="number"
              value={offerData.amount}
              onChange={(e) => setOfferData(prev => ({ ...prev, amount: e.target.value }))}
              className="pl-10"
              placeholder="输入您的报价"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            联系邮箱
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              value={offerData.email}
              onChange={(e) => setOfferData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            联系电话
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="tel"
              value={offerData.phone}
              onChange={(e) => setOfferData(prev => ({ ...prev, phone: e.target.value }))}
              className="pl-10"
              placeholder="您的联系电话"
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          提交报价
        </Button>
      </form>
    </div>
  );

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-xl">
        {!showPayment && !showOffer && renderMainContent()}
        {showPayment && renderPaymentContent()}
        {showOffer && renderOfferContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;