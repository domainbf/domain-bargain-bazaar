
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 p-6 rounded-lg border border-gray-800">
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
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              取消
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "提交中..." : "提交报价"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;
