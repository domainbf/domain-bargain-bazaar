import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const StaticPage = () => {
  const { slug } = useParams();
  
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
        <Navigation />
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
          <Card className="p-6 bg-black/40 backdrop-blur-lg border border-white/20">
            <h1 className="text-2xl font-bold text-white">页面未找到</h1>
            <p className="text-gray-300">抱歉，您请求的页面不存在。</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-200px)]">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">{page.title}</h1>
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300">
            <ReactMarkdown>{page.content || ''}</ReactMarkdown>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default StaticPage;