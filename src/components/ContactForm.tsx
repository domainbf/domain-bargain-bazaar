import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>();
  const { toast } = useToast();
  const { t } = useTranslation();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message,
          to: ['admin@domain.bf']
        }
      });

      if (error) throw error;

      toast({
        title: t('contact.success.title'),
        description: t('contact.success.description'),
      });
      reset();
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: t('contact.error.title'),
        description: t('contact.error.description'),
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('name', { required: true })}
          placeholder={t('contact.form.name')}
          className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
      <div>
        <Input
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          type="email"
          placeholder={t('contact.form.email')}
          className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
      <div>
        <Textarea
          {...register('message', { required: true })}
          placeholder={t('contact.form.message')}
          className="w-full min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      </Button>
    </form>
  );
};

export default ContactForm;