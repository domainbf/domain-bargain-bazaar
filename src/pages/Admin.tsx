import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/admin/LoginForm';
import DomainForm from '@/components/admin/DomainForm';
import DomainList from '@/components/admin/DomainList';
import ContentManager from '@/components/admin/ContentManager';
import PageManager from '@/components/admin/PageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDomainForm, setShowDomainForm] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const { data: domains } = useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session
  });

  if (!isAuthenticated && !session) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>
      
      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="domains" className="flex items-center gap-2 data-[state=active]:bg-white/10">
            <Globe className="h-4 w-4" />
            域名管理
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2 data-[state=active]:bg-white/10">
            <FileText className="h-4 w-4" />
            页面管理
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-white/10">
            <Settings className="h-4 w-4" />
            网站设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>添加新域名</CardTitle>
              <CardDescription>
                在这里添加新的域名到系统中。您可以设置域名的类别、价格和其他属性。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainForm onSuccess={() => setShowDomainForm(false)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>域名列表</CardTitle>
              <CardDescription>
                管理所有域名，包括编辑、删除和状态更新。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainList domains={domains || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <PageManager />
        </TabsContent>

        <TabsContent value="content">
          <ContentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;