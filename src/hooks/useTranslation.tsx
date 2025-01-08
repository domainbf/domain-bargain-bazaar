import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const defaultTranslations = {
  'domain.purchase.buy_now': '立即购买',
  'domain.purchase.make_offer': '我要出价',
  'domain.purchase.secure_transaction': '安全交易',
  'domain.purchase.protection': '所有交易都受到我们的购买保护',
  'domain.purchase.error': '提交失败',
  'domain.purchase.domain_no_owner': '域名没有所有者',
  // ... 其他默认翻译
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