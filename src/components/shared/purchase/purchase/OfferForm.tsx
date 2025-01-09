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
}

export const OfferForm: React.FC<OfferFormProps> = ({ domain, onClose }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount: domain.minimum_offer || domain.price * 0.8,
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: any) => {
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <Button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        提交报价
      </Button>
    </form>
  );
};