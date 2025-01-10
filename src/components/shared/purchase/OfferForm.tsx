import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Domain } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';

interface OfferFormProps {
  domain: Domain;
  onClose: () => void;
}

export const OfferForm = ({ domain, onClose }: OfferFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: domain.minimum_offer || domain.price * 0.8,
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Handle offer submission logic here
      toast({
        title: "报价已提交",
        description: "我们会尽快与您联系",
      });
      onClose();
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          出价金额
        </label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          min={domain.minimum_offer || domain.price * 0.8}
          required
          className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          联系邮箱
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          联系电话
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
          placeholder="+1234567890"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          留言信息
        </label>
        <Textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
          rows={4}
          placeholder="请输入您的留言..."
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? "提交中..." : "提交报价"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          取消
        </Button>
      </div>
    </form>
  );
};