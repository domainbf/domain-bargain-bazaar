
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OfferFormFields from './offer/OfferFormFields';
import { useOfferSubmission } from './offer/useOfferSubmission';

interface OfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDomain?: { id: string; name: string; price: number; owner_id?: string };
}

const OfferForm: React.FC<OfferFormProps> = ({ isOpen, onClose, selectedDomain }) => {
  const { isSubmitting, handleSubmit } = useOfferSubmission({ selectedDomain, onClose });

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-white mb-2">
          为 {selectedDomain?.name} 出价
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          当前价格: ${selectedDomain?.price?.toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <OfferFormFields isSubmitting={isSubmitting} />
        <Button 
  type="submit" 
  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
  disabled={isSubmitting}
>
  {isSubmitting ? "提交中..." : "提交报价"}
</Button>
      </form>
    </div>
  );
};

export default OfferForm;
