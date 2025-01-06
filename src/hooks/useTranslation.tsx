import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

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
        
        return translationMap;
      } catch (error) {
        console.error('Error in translations query:', error);
        return {};
      }
    },
    retry: 2
  });

  const t = (key: string): string => {
    if (!translations) return key;
    return translations[key] || key;
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