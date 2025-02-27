
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Domain } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DollarSign, Mail, Phone, MessageSquare } from 'lucide-react';

interface OfferFormData {
  amount: number;
  email: string;
  phone: string;
  message: string;
}

interface OfferFormProps {
  domain: Domain;
  onClose: () => void;
  onSubmit?: (data: OfferFormData) => Promise<void>;
}

export const OfferForm: React.FC<OfferFormProps> = ({ domain, onClose, onSubmit }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OfferFormData>({
    defaultValues: {
      amount: domain.minimum_offer || domain.price * 0.8,
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmitForm = async (data: OfferFormData) => {
    try {
      // Create the offer in the database
      const { error: offerError } = await supabase
        .from('domain_offers')
        .insert({
          domain_id: domain.id,
          seller_id: domain.owner_id,
          amount: data.amount,
          message: data.message
        });

      if (offerError) throw offerError;

      // Send email notification
      const { error: notificationError } = await supabase.functions.invoke('send-offer-notification', {
        body: {
          domainName: domain.name,
          amount: data.amount,
          buyerEmail: data.email,
          buyerPhone: data.phone,
          message: data.message,
          ownerEmail: domain.owner_id // We'll get the actual email from the profiles table in the edge function
        }
      });

      if (notificationError) throw notificationError;

      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(data);
      }

      toast({
        title: "报价已提交",
        description: "我们会尽快与您联系",
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting offer:', error);
      toast({
        title: "提交失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-lg p-5 border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">您的报价信息</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-300 mb-2">
              <DollarSign className="h-4 w-4" />
              出价金额
            </label>
            <div className="relative">
              <Input
                type="number"
                {...register('amount', { 
                  required: true,
                  min: domain.minimum_offer || domain.price * 0.8 
                })}
                className="bg-slate-800/70 border-slate-700 text-white placeholder-gray-400 pl-7"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">请输入有效金额</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-300 mb-2">
              <Mail className="h-4 w-4" />
              联系邮箱
            </label>
            <Input
              type="email"
              {...register('email', { required: true })}
              className="bg-slate-800/70 border-slate-700 text-white placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">请输入有效邮箱</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-300 mb-2">
              <Phone className="h-4 w-4" />
              联系电话
            </label>
            <Input
              type="tel"
              {...register('phone')}
              className="bg-slate-800/70 border-slate-700 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-300 mb-2">
              <MessageSquare className="h-4 w-4" />
              留言信息
            </label>
            <Textarea
              {...register('message')}
              className="bg-slate-800/70 border-slate-700 text-white placeholder-gray-400"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          {isSubmitting ? "提交中..." : "提交报价"}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          取消
        </Button>
      </div>
    </form>
  );
};
