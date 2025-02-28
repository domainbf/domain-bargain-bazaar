
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Globe, DollarSign, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PayPalButton from '../PayPalButton';
import { useTranslation } from '@/hooks/useTranslation';
import OfferForm from '../OfferForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
  owner_id?: string;
}

interface PurchaseDialogProps {
  domain: Domain | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PurchaseDialog = ({ domain, onOpenChange, onSuccess }: PurchaseDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  if (!domain) return null;

  const handleBuyNow = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Here we would typically redirect to payment processing
      // For now, just show a toast as a placeholder
      toast({
        title: "正在准备支付",
        description: "请稍候，我们正在准备支付流程...",
      });
      
      // Simulate payment process
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
      
    } catch (error) {
      setIsProcessing(false);
      setPaymentError("支付处理出错，请稍后再试");
      console.error("Payment error:", error);
    }
  };

  const handleOfferFormClose = () => {
    setShowOfferForm(false);
  };

  const handlePayPalSuccess = async (details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Record transaction
        const { error } = await supabase.from('transactions').insert({
          domain_id: domain.id,
          buyer_id: user.id,
          amount: domain.price,
          payment_method: 'paypal',
          payment_id: details.id,
          status: 'completed'
        });
        
        if (error) throw error;
        
        // Update domain status
        const { error: domainError } = await supabase
          .from('domains')
          .update({ status: 'sold' })
          .eq('id', domain.id);
          
        if (domainError) throw domainError;
      }
      
      toast({
        title: "购买成功!",
        description: "恭喜您，域名购买成功!",
        variant: "default",
      });
      
      onSuccess();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Transaction recording error:", error);
      toast({
        title: "错误",
        description: error.message || "交易记录出错，请联系客服",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
        <DialogHeader className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-6 w-6 text-blue-400" />
            <DialogTitle className="text-2xl font-bold text-white">
              {domain.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {showOfferForm ? (
          <OfferForm
            isOpen={showOfferForm}
            onClose={handleOfferFormClose}
            selectedDomain={domain}
          />
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <div className="mb-2 text-sm font-medium text-gray-300">购买价格</div>
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold text-white">{domain.price.toLocaleString()}</span>
                <span className="text-gray-300">USD</span>
              </div>
            </div>

            {paymentError && (
              <div className="bg-red-900/20 text-red-300 p-3 rounded-lg border border-red-900/40 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm">{paymentError}</p>
              </div>
            )}

            <div className="grid gap-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-6"
                onClick={handleBuyNow}
                disabled={isProcessing}
              >
                {isProcessing ? "处理中..." : "立即购买"}
              </Button>
              <Button 
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setShowOfferForm(true)}
              >
                我要出价
              </Button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm border border-gray-700">
              <PayPalButton
                amount={domain.price}
                onSuccess={handlePayPalSuccess}
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
              <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-white">
                  安全交易
                </p>
                <p className="text-sm text-gray-300">
                  所有交易都受到我们的购买保护
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
