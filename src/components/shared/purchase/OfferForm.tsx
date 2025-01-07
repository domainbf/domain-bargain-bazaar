import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/hooks/useTranslation';
import { Domain } from '@/types/domain';

interface OfferFormProps {
  domain: Domain;
  onClose: () => void;
  onSubmit: (offerData: {
    amount: number;
    email: string;
    phone: string;
    message: string;
  }) => Promise<void>;
}

export const OfferForm = ({ domain, onClose, onSubmit }: OfferFormProps) => {
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

    if (!domain.owner_id) {
      toast({
        title: t('error'),
        description: t('domain_no_owner'),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        amount: Number(formData.amount),
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      onClose();
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: t('offer_error'),
        description: t('offer_error_message'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-100 mb-1">
          {t('offer_amount_label')}
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 h-5 w-5" />
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="pl-10 bg-purple-900/20 border-purple-300/20 text-purple-100 placeholder:text-purple-400"
            placeholder={t('offer_amount_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-100 mb-1">
          {t('contact_email_label')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 h-5 w-5" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-10 bg-purple-900/20 border-purple-300/20 text-purple-100 placeholder:text-purple-400"
            placeholder={t('email_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-100 mb-1">
          {t('contact_phone_label')}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 h-5 w-5" />
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="pl-10 bg-purple-900/20 border-purple-300/20 text-purple-100 placeholder:text-purple-400"
            placeholder={t('phone_placeholder')}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-100 mb-1">
          {t('message_label')}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-purple-900/20 border border-purple-300/20 rounded-md focus:ring-purple-500 focus:border-purple-500 text-purple-100 placeholder:text-purple-400"
          rows={4}
          placeholder={t('message_placeholder')}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('submitting_offer') : t('submit_offer')}
      </Button>
    </form>
  );
};