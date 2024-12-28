import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState(() => 
    localStorage.getItem('selectedLanguage') || 'zh'
  );

  const { data: translations } = useQuery({
    queryKey: ['translations', currentLang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_code', currentLang);
      
      if (error) throw error;
      
      const translationMap = data.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      
      return translationMap;
    }
  });

  const t = (key: string): string => {
    if (!translations) return key;
    return translations[key] || key;
  };

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  return { t, currentLang, changeLanguage };
};