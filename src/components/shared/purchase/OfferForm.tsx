import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Domain } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';

interface OfferFormProps {
  domain: Domain;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    email: string;
    phone: string;
    message: string;
  }) => Promise<void>;
}

export const OfferForm: React.FC<OfferFormProps> = ({ domain, onClose, onSubmit }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      amount: domain.minimum_offer || domain.price * 0.8,
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmitForm = async (data: any) => {
    try {
      await onSubmit(data);
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          出价金额
        </label>
        <Input
          type="number"
          {...register('amount', { 
            required: true,
            min: domain.minimum_offer || domain.price * 0.8 
          })}
          className="bg-gray-800/50 border-white/20 text-white"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">请输入有效金额</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          联系邮箱
        </label>
        <Input
          type="email"
          {...register('email', { required: true })}
          className="bg-gray-800/50 border-white/20 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          联系电话
        </label>
        <Input
          type="tel"
          {...register('phone')}
          className="bg-gray-800/50 border-white/20 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          留言信息
        </label>
        <Textarea
          {...register('message')}
          className="bg-gray-800/50 border-white/20 text-white"
          rows={4}
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