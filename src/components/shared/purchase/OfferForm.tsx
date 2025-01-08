import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Mail, Phone } from 'lucide-react';
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
        title: t('domain.purchase.offer_error'),
        description: t('domain.purchase.offer_error_message'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          {t('domain.purchase.offer_amount')}
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder={t('domain.purchase.offer_amount_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          {t('domain.purchase.contact_email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder={t('domain.purchase.email_placeholder')}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          {t('domain.purchase.contact_phone')}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder={t('domain.purchase.phone_placeholder')}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          {t('domain.purchase.message')}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50"
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