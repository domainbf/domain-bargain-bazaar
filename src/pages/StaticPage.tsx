import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">页面未找到</h1>
          <p className="text-gray-600">抱歉，您请求的页面不存在。</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{page.content || ''}</ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaticPage;