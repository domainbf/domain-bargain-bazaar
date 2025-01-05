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
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_code', currentLang);
      
      if (error) {
        console.error('Translation error:', error);
        toast({
          title: "Error loading translations",
          description: "Using default text",
          variant: "destructive",
        });
        throw error;
      }
      
      const translationMap = data.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      
      return translationMap;
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
        title: "Error loading translations",
        description: "Using default text",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return { t, currentLang, changeLanguage };
};