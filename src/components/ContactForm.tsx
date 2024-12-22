import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { sendFeedbackEmail } from '@/lib/email';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendFeedbackEmail(data);
      toast({
        title: "提交成功",
        description: "我们已收到您的反馈，将尽快与您联系。",
      });
      reset();
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请稍后重试。",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('name', { required: true })}
          placeholder="您的姓名"
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          type="email"
          placeholder="您的邮箱"
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          {...register('message', { required: true })}
          placeholder="请输入您的留言"
          className="w-full min-h-[150px]"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? '提交中...' : '提交反馈'}
      </Button>
    </form>
  );
};

export default ContactForm;