import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PayPalButton from '../PayPalButton';
import { useTranslation } from '@/hooks/useTranslation';

interface Domain {
  id: string;
  name: string;
  price: number;
}

interface PurchaseDialogProps {
  domain: Domain | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PurchaseDialog = ({ domain, onOpenChange, onSuccess }: PurchaseDialogProps) => {
  const { t } = useTranslation();
  
  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-black border border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-6 w-6 text-blue-400" />
            <DialogTitle className="text-2xl font-bold text-white">
              {domain.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Price Display */}
          <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
            <div className="mb-2 text-sm font-medium text-white/70">Purchase Price</div>
            <div className="flex items-baseline gap-2">
              <DollarSign className="h-6 w-6 text-blue-400" />
              <span className="text-3xl font-bold text-white">{domain.price.toLocaleString()}</span>
              <span className="text-white/70">USD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-6"
              onClick={() => {}}
            >
              Buy Now
            </Button>
            <Button 
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
              onClick={() => {}}
            >
              Make Offer
            </Button>
          </div>

          {/* PayPal Button */}
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <PayPalButton
              amount={domain.price}
              onSuccess={onSuccess}
            />
          </div>

          {/* Security Message */}
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-white">
                Secure Transaction
              </p>
              <p className="text-sm text-white/70">
                Secure transaction backed by our purchase protection
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;