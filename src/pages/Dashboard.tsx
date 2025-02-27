
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  DollarSign, 
  ListPlus, 
  Edit, 
  Trash2, 
  Globe,
  AlertCircle
} from 'lucide-react';
import OfferList from '@/components/dashboard/OfferList';
import DomainSalesList from '@/components/dashboard/DomainSalesList';
import PurchaseHistory from '@/components/dashboard/PurchaseHistory';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

interface DomainFormData {
  name: string;
  price: number;
  description: string;
  category: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [editDomainOpen, setEditDomainOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DomainFormData>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue } = useForm<DomainFormData>();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: myDomains, refetch: refetchDomains } = useQuery({
    queryKey: ['my-domains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const onAddDomain = async (data: DomainFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('domains')
        .insert({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          owner_id: user.id,
          status: 'available'
        });

      if (error) throw error;
      
      toast({
        title: "域名添加成功",
        description: "您的域名已添加到市场",
      });
      
      reset();
      setAddDomainOpen(false);
      refetchDomains();
    } catch (error: any) {
      toast({
        title: "添加失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onEditDomain = async (data: DomainFormData) => {
    if (!selectedDomain) return;
    
    try {
      const { error } = await supabase
        .from('domains')
        .update({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
        })
        .eq('id', selectedDomain.id);

      if (error) throw error;
      
      toast({
        title: "域名更新成功",
        description: "您的域名信息已更新",
      });
      
      resetEdit();
      setEditDomainOpen(false);
      setSelectedDomain(null);
      refetchDomains();
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onDeleteDomain = async () => {
    if (!selectedDomain) return;
    
    try {
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', selectedDomain.id);

      if (error) throw error;
      
      toast({
        title: "域名已删除",
        description: "您的域名已从市场中移除",
      });
      
      setDeleteConfirmOpen(false);
      setSelectedDomain(null);
      refetchDomains();
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (domain: any) => {
    setSelectedDomain(domain);
    setValue('name', domain.name);
    setValue('price', domain.price);
    setValue('description', domain.description || '');
    setValue('category', domain.category || '');
    setEditDomainOpen(true);
  };

  const handleDeleteClick = (domain: any) => {
    setSelectedDomain(domain);
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">用户中心</h1>
          {profile?.is_seller && (
            <Button 
              onClick={() => setAddDomainOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <ListPlus className="mr-2 h-4 w-4" />
              添加域名
            </Button>
          )}
        </div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="bg-white/10 text-white">
            <TabsTrigger value="purchases" className="data-[state=active]:bg-white/20">
              <ShoppingCart className="mr-2 h-4 w-4" />
              我的购买
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-white/20">
              <DollarSign className="mr-2 h-4 w-4" />
              我的销售
            </TabsTrigger>
            <TabsTrigger value="domains" className="data-[state=active]:bg-white/20">
              <Globe className="mr-2 h-4 w-4" />
              我的域名
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">购买历史</h2>
              <PurchaseHistory />
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">我的报价</h2>
              <OfferList />
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">销售记录</h2>
              <DomainSalesList />
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">我的域名</h2>
              
              {myDomains && myDomains.length > 0 ? (
                <div className="space-y-4">
                  {myDomains.map((domain: any) => (
                    <div key={domain.id} className="bg-white/10 rounded-lg p-4 border border-white/10 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-white">{domain.name}</h3>
                          <Badge className={domain.status === 'available' ? 'bg-green-600' : 'bg-blue-600'}>
                            {domain.status === 'available' ? '可售' : '已售'}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{domain.description || '无描述'}</p>
                        <div className="mt-2 text-blue-400 font-semibold">${domain.price.toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(domain)}
                          className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(domain)}
                          className="border-red-600/40 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">您还没有添加域名</p>
                  <Button 
                    onClick={() => setAddDomainOpen(true)}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500"
                  >
                    添加域名
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* 添加域名对话框 */}
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">添加域名</DialogTitle>
            <DialogDescription className="text-gray-300">
              填写域名信息，添加到域名市场进行销售
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onAddDomain)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">域名</label>
              <Input
                {...register('name', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="example.com"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">请输入域名</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">价格 (USD)</label>
              <Input
                {...register('price', { required: true, min: 1 })}
                type="number"
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="1000"
              />
              {errors.price && <p className="text-red-400 text-sm mt-1">请输入有效价格</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">分类</label>
              <Input
                {...register('category')}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="科技、教育、金融等"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">描述</label>
              <Textarea
                {...register('description')}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="域名描述信息"
                rows={3}
              />
            </div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAddDomainOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                取消
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '添加域名'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 编辑域名对话框 */}
      <Dialog open={editDomainOpen} onOpenChange={setEditDomainOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">编辑域名</DialogTitle>
            <DialogDescription className="text-gray-300">
              修改域名信息
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit(onEditDomain)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">域名</label>
              <Input
                {...registerEdit('name', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="example.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">价格 (USD)</label>
              <Input
                {...registerEdit('price', { required: true, min: 1 })}
                type="number"
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="1000"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">分类</label>
              <Input
                {...registerEdit('category')}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="科技、教育、金融等"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">描述</label>
              <Textarea
                {...registerEdit('description')}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="域名描述信息"
                rows={3}
              />
            </div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDomainOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                取消
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                保存修改
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              确认删除
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              您确定要删除域名 <span className="text-white font-medium">{selectedDomain?.name}</span> 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              取消
            </Button>
            <Button 
              type="button"
              onClick={onDeleteDomain}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
