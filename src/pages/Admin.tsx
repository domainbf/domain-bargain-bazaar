import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/admin/LoginForm';
import DomainForm from '@/components/admin/DomainForm';
import DomainList from '@/components/admin/DomainList';
import ContentManager from '@/components/admin/ContentManager';
import PageManager from '@/components/admin/PageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, FileText, Type, PaintBucket } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TextManager from '@/components/admin/TextManager';
import ColorSchemeManager from '@/components/admin/ColorSchemeManager';

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

  if (!isAuthenticated && !session) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">管理后台</h1>
        
        <Tabs defaultValue="domains" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="domains" className="flex items-center gap-2 data-[state=active]:bg-white/20">
              <Globe className="h-4 w-4" />
              域名管理
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2 data-[state=active]:bg-white/20">
              <FileText className="h-4 w-4" />
              页面管理
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2 data-[state=active]:bg-white/20">
              <Type className="h-4 w-4" />
              文字管理
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2 data-[state=active]:bg-white/20">
              <PaintBucket className="h-4 w-4" />
              颜色方案
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-white/20">
              <Settings className="h-4 w-4" />
              网站设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">添加新域名</CardTitle>
                <CardDescription className="text-gray-300">
                  在这里添加新的域名到系统中。您可以设置域名的类别、价格和其他属性。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DomainForm onSuccess={() => setShowDomainForm(false)} />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">域名列表</CardTitle>
                <CardDescription className="text-gray-300">
                  管理所有域名，包括编辑、删除和状态更新。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DomainList domains={[]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card className="bg-white/5 border-white/10">
              <CardContent>
                <PageManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text">
            <Card className="bg-white/5 border-white/10">
              <CardContent>
                <TextManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card className="bg-white/5 border-white/10">
              <CardContent>
                <ColorSchemeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-white/5 border-white/10">
              <CardContent>
                <ContentManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;