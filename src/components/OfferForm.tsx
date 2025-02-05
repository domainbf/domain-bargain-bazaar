import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDomain?: { id: string; name: string; price: number; owner_id?: string };
}

const OfferForm: React.FC<OfferFormProps> = ({ isOpen, onClose, selectedDomain }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('请先登录');
      }

      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        amount: Number(formData.get('offer')),
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
        domain_id: selectedDomain?.id,
        seller_id: selectedDomain?.owner_id,
        buyer_id: user.id // Set the buyer_id to the current user's ID
      };

      if (!selectedDomain?.owner_id) {
        throw new Error('域名没有所有者');
      }

      const { error: offerError } = await supabase
        .from('domain_offers')
        .insert({
          domain_id: data.domain_id,
          seller_id: data.seller_id,
          buyer_id: data.buyer_id,
          amount: data.amount,
          message: data.message
        });

      if (offerError) throw offerError;

      const { error: notificationError } = await supabase.functions.invoke('send-offer-notification', {
        body: {
          domainName: selectedDomain.name,
          amount: data.amount,
          buyerEmail: data.email,
          buyerPhone: data.phone,
          message: data.message,
          ownerEmail: 'owner@domain.bf'
        }
      });

      if (notificationError) throw notificationError;
      
      toast({
        title: "报价已提交！",
        description: "我们会尽快与您联系。",
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting offer:', error);
      toast({
        title: "提交失败",
        description: error.message || "提交报价失败，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div>
          <Input 
            name="email" 
            type="email" 
            placeholder="您的邮箱" 
            required 
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <div>
          <Input 
            name="phone" 
            type="tel" 
            placeholder="您的电话" 
            required 
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
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <div>
          <Textarea 
            name="message" 
            placeholder="附加信息（可选）"
            rows={4}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
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