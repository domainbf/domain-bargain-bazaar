import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Language {
  code: string;
  name: string;
  is_default: boolean;
}

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = React.useState('zh');

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data as Language[];
    }
  });

  const { data: translations } = useQuery({
    queryKey: ['translations', currentLang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_code', currentLang);
      
      if (error) throw error;
      return data;
    }
  });

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    // Update translations in the app
    if (translations) {
      const translationMap = translations.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      window.localStorage.setItem('translations', JSON.stringify(translationMap));
      window.dispatchEvent(new Event('languageChanged'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages?.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;