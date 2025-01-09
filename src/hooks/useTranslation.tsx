import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const defaultTranslations = {
  'domain.purchase.buy_now': '立即购买',
  'domain.purchase.make_offer': '我要出价',
  'domain.purchase.secure_transaction': '安全交易保障',
  'domain.purchase.protection': '所有交易都受到我们的购买保护',
  'domain.purchase.error': '提交失败',
  'domain.purchase.domain_no_owner': '域名没有所有者',
  'domain.purchase.price_label': '购买价格',
  'domain.purchase.back': '返回',
  'domain.purchase.offer_amount': '出价金额',
  'domain.purchase.offer_amount_placeholder': '请输入您的出价金额',
  'domain.purchase.contact_email': '联系邮箱',
  'domain.purchase.email_placeholder': '请输入您的邮箱',
  'domain.purchase.contact_phone': '联系电话',
  'domain.purchase.phone_placeholder': '请输入您的电话',
  'domain.purchase.message': '留言信息',
  'domain.purchase.message_placeholder': '请输入您想告诉卖家的信息',
  'domain.purchase.submit_offer': '提交报价',
  'domain.purchase.submitting_offer': '正在提交...',
  'domain.purchase.offer_submitted': '报价已提交',
  'domain.purchase.offer_success_message': '您的报价已成功提交，我们会尽快通知域名持有人。',
  'domain.purchase.offer_error': '提交报价失败',
  'domain.purchase.offer_error_message': '提交报价时发生错误，请稍后重试。'
};

export const useTranslation = () => {
  const { toast } = useToast();
  const [currentLang, setCurrentLang] = useState(() => 
    localStorage.getItem('selectedLanguage') || 'zh'
  );

  const { data: translations, error } = useQuery({
    queryKey: ['translations', currentLang],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .eq('language_code', currentLang);
        
        if (error) {
          console.error('Translation error:', error);
          toast({
            title: "加载翻译失败",
            description: "使用默认文本",
            variant: "destructive",
          });
          throw error;
        }
        
        const translationMap = data.reduce((acc: Record<string, string>, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        
        return { ...defaultTranslations, ...translationMap };
      } catch (error) {
        console.error('Error in translations query:', error);
        return defaultTranslations;
      }
    },
    retry: 2
  });

  const t = (key: string): string => {
    if (!translations) return defaultTranslations[key] || key;
    return translations[key] || defaultTranslations[key] || key;
  };

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('selectedLanguage', lang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  useEffect(() => {
    if (error) {
      console.error('Translation error:', error);
      toast({
        title: "加载翻译失败",
        description: "使用默认文本",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return { t, currentLang, changeLanguage };
};