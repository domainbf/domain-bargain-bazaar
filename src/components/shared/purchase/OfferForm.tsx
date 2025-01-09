import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Domain } from '@/types/domain';
import { supabase } from '@/lib/supabase';

interface OfferFormProps {
  domain: Domain;
  onClose: () => void;
}

export const OfferForm = ({ domain, onClose }: OfferFormProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!domain.owner_id) {
        throw new Error(t('domain.purchase.domain_no_owner'));
      }

      // Save offer to database
      const { error: offerError } = await supabase
        .from('domain_offers')
        .insert({
          domain_id: domain.id,
          seller_id: domain.owner_id,
          amount: Number(formData.amount),
          message: formData.message
        });

      if (offerError) throw offerError;

      // Send notification email
      const { error: notificationError } = await supabase.functions.invoke('send-offer-notification', {
        body: {
          domainName: domain.name,
          amount: Number(formData.amount),
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          message: formData.message,
          ownerEmail: domain.owner_id // This will be replaced with actual owner email in the edge function
        }
      });

      if (notificationError) throw notificationError;

      toast({
        title: t('domain.purchase.offer_submitted'),
        description: t('domain.purchase.offer_success_message'),
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting offer:', error);
      toast({
        title: t('domain.purchase.offer_error'),
        description: error.message || t('domain.purchase.offer_error_message'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('domain.purchase.offer_amount')}
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="pl-10 bg-gray-900/50 border-white/20 text-white placeholder:text-gray-500"
            placeholder={t('domain.purchase.offer_amount_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('domain.purchase.contact_email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-10 bg-gray-900/50 border-white/20 text-white placeholder:text-gray-500"
            placeholder={t('domain.purchase.email_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('domain.purchase.contact_phone')}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="pl-10 bg-gray-900/50 border-white/20 text-white placeholder:text-gray-500"
            placeholder={t('domain.purchase.phone_placeholder')}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('domain.purchase.message')}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-900/50 border border-white/20 rounded-md text-white placeholder:text-gray-500"
          rows={4}
          placeholder={t('domain.purchase.message_placeholder')}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('domain.purchase.submitting_offer') : t('domain.purchase.submit_offer')}
      </Button>
    </form>
  );
};