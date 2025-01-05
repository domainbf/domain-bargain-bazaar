import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, DollarSign, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import PayPalButton from '../PayPalButton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
  const { data: settings } = useQuery({
    queryKey: ['site-settings', 'purchase-dialog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', [
          'purchase_dialog_title',
          'purchase_dialog_description',
          'purchase_security_message'
        ]);
      
      if (error) throw error;
      return Object.fromEntries(data.map(item => [item.key, item.value]));
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Globe className="h-8 w-8" />
              {domain.name}
            </DialogTitle>
            <p className="text-lg font-medium opacity-90">
              {settings?.purchase_dialog_description || "This domain is available for purchase"}
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Price Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <p className="text-gray-600 font-medium">Purchase Price</p>
              <div className="flex items-center text-gray-900">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <span className="text-3xl font-bold">{domain.price.toLocaleString()}</span>
                <span className="ml-2 text-gray-500">USD</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <ArrowRight className="h-5 w-5" />
              <span className="font-medium">Buy Now</span>
            </div>
          </div>

          {/* Security Message */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
            <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
            <div className="space-y-1">
              <p className="font-medium text-green-800">Secure Purchase</p>
              <p className="text-green-700 text-sm">
                {settings?.purchase_security_message || 
                "Your purchase is protected by our secure payment system. The domain will be automatically transferred to your account upon successful payment."}
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-800">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">Select Payment Method</h4>
            </div>
            
            <div className={cn(
              "bg-white rounded-lg border border-gray-200 p-4",
              isProcessing && "opacity-50 pointer-events-none"
            )}>
              <PayPalButton
                amount={domain.price}
                onSuccess={onSuccess}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 text-center">
            By proceeding with the purchase, you agree to our terms of service and domain transfer policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;