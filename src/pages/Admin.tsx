import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/admin/LoginForm';
import DomainForm from '@/components/admin/DomainForm';
import DomainList from '@/components/admin/DomainList';
import ContentManager from '@/components/admin/ContentManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, MessageSquare } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  if (!isAuthenticated && !session) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>
      
      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            域名管理
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            内容管理
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            反馈管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          <DomainForm onSuccess={() => {}} />
          <DomainList domains={[]} />
        </TabsContent>

        <TabsContent value="content">
          <ContentManager />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;