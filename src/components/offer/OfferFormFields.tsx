
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from 'lucide-react';

interface OfferFormFieldsProps {
  isSubmitting: boolean;
}

const OfferFormFields: React.FC<OfferFormFieldsProps> = ({ isSubmitting }) => {
  return (
    <>
      <div>
        <Input 
          name="email" 
          type="email" 
          placeholder="您的邮箱" 
          required 
          disabled={isSubmitting}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
      <div>
        <Input 
          name="phone" 
          type="tel" 
          placeholder="您的电话" 
          required 
          disabled={isSubmitting}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          name="offer" 
          type="number" 
          placeholder="您的报价 (USD)" 
          min="1"
          required 
          disabled={isSubmitting}
          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
      <div>
        <Textarea 
          name="message" 
          placeholder="附加信息（可选）"
          rows={4}
          disabled={isSubmitting}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
    </>
  );
};

export default OfferFormFields;
