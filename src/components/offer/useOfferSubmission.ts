
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

interface UseOfferSubmissionProps {
  selectedDomain?: { 
    id: string; 
    name: string; 
    price: number; 
    owner_id?: string 
  };
  onClose: () => void;
}

export const useOfferSubmission = ({ selectedDomain, onClose }: UseOfferSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        buyer_id: user.id
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

  return {
    isSubmitting,
    handleSubmit
  };
};
