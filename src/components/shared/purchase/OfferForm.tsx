import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Domain } from '@/types/domain';

interface OfferFormProps {
  domain: Domain;
  onSubmit: (offerData: {
    amount: number;
    email: string;
    phone: string;
    message: string;
  }) => Promise<void>;
  onClose: () => void;
}

export const OfferForm = ({ domain, onSubmit, onClose }: OfferFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: domain.minimum_offer || domain.price || 0,
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          {t('domain.purchase.offer_amount')}
        </label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          min={domain.minimum_offer || 0}
          required
          className="bg-gray-800/50 border-white/10 text-white"
          placeholder={t('domain.purchase.offer_amount_placeholder')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t('domain.purchase.contact_email')}
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-gray-800/50 border-white/10 text-white"
          placeholder={t('domain.purchase.email_placeholder')}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          {t('domain.purchase.contact_phone')}
        </label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="bg-gray-800/50 border-white/10 text-white"
          placeholder={t('domain.purchase.phone_placeholder')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {t('domain.purchase.message')}
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-gray-800/50 border-white/10 text-white min-h-[100px]"
          placeholder={t('domain.purchase.message_placeholder')}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? t('domain.purchase.submitting_offer') : t('domain.purchase.submit_offer')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-white/10 text-white hover:bg-white/10"
        >
          {t('domain.purchase.cancel')}
        </Button>
      </div>
    </form>
  );
};