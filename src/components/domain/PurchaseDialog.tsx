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
import OfferForm from '../OfferForm';

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
  const [showOfferForm, setShowOfferForm] = React.useState(false);
  
  if (!domain) return null;

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
            onClose={() => setShowOfferForm(false)}
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

            <div className="grid gap-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-6"
                onClick={() => {}}
              >
                立即购买
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
                onSuccess={onSuccess}
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