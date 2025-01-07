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
        body: data
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
          className="w-full"
        />
      </div>
      <div>
        <Input
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          type="email"
          placeholder={t('contact.form.email')}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          {...register('message', { required: true })}
          placeholder={t('contact.form.message')}
          className="w-full min-h-[150px]"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      </Button>
    </form>
  );
};

export default ContactForm;