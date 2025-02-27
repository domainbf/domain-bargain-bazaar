
import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ChevronRight,
  Heart,
  BarChart3,
  Shield,
  CheckCircle2,
  Settings2,
  UserCircle,
  Clock,
  ExternalLink,
  Copy
} from 'lucide-react';
import OfferList from '@/components/dashboard/OfferList';
import DomainSalesList from '@/components/dashboard/DomainSalesList';
import PurchaseHistory from '@/components/dashboard/PurchaseHistory';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DomainFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  is_featured?: boolean;
  minimum_offer?: number;
  sale_type?: string;
  keywords?: string;
  meta_title?: string;
  meta_description?: string;
}

interface ProfileFormData {
  full_name: string;
  bio: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
}

interface VerificationFormData {
  verification_value: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [editDomainOpen, setEditDomainOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [favoriteDomainsIds, setFavoriteDomainsIds] = useState<string[]>([]);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [verificationType, setVerificationType] = useState('dns');
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DomainFormData>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue } = useForm<DomainFormData>();
  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm<ProfileFormData>();
  const { register: registerVerification, handleSubmit: handleSubmitVerification, formState: { errors: verificationErrors } } = useForm<VerificationFormData>();
  
  // Get user profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
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

  // Get user's domains
  const { data: myDomains, isLoading: domainsLoading, refetch: refetchDomains } = useQuery({
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

  // Get user's favorite domains
  const { data: favoriteDomains, refetch: refetchFavorites } = useQuery({
    queryKey: ['favorite-domains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('domain_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get domain analytics
  const { data: domainAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['domain-analytics'],
    enabled: !!myDomains && myDomains.length > 0,
    queryFn: async () => {
      if (!myDomains || myDomains.length === 0) return [];
      
      const domainIds = myDomains.map((domain: any) => domain.id);
      const { data, error } = await supabase
        .from('domain_analytics')
        .select('*')
        .in('domain_id', domainIds);
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (favoriteDomains) {
      setFavoriteDomainsIds(favoriteDomains.map((fav: any) => fav.domain_id));
    }
  }, [favoriteDomains]);

  const onAddDomain = async (data: DomainFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert keywords string to array
      const keywords = data.keywords ? data.keywords.split(',').map(k => k.trim()) : [];

      const { error } = await supabase
        .from('domains')
        .insert({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          owner_id: user.id,
          status: 'available',
          keywords: keywords,
          sale_type: data.sale_type || 'both',
          meta_title: data.meta_title || data.name,
          meta_description: data.meta_description || data.description,
          minimum_offer: data.minimum_offer || Math.floor(data.price * 0.8)
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
      // Convert keywords string to array
      const keywords = data.keywords ? data.keywords.split(',').map(k => k.trim()) : [];

      const { error } = await supabase
        .from('domains')
        .update({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          keywords: keywords,
          sale_type: data.sale_type || 'both',
          meta_title: data.meta_title || data.name,
          meta_description: data.meta_description || data.description,
          minimum_offer: data.minimum_offer || Math.floor(data.price * 0.8)
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

  const onVerifyDomain = async (data: VerificationFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('domain_verifications')
        .insert({
          domain_id: selectedDomain.id,
          user_id: user.id,
          verification_type: verificationType,
          verification_data: { value: data.verification_value }
        });

      if (error) throw error;
      
      toast({
        title: "验证请求已提交",
        description: "我们将尽快审核您的域名所有权",
      });
      
      setVerificationOpen(false);
    } catch (error: any) {
      toast({
        title: "提交失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          company_name: data.company_name
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "个人资料已更新",
        description: "您的个人资料信息已成功更新",
      });
      
      setProfileEditOpen(false);
      refetchProfile();
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (domainId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (favoriteDomainsIds.includes(domainId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('domain_id', domainId);

        if (error) throw error;
        
        setFavoriteDomainsIds(prev => prev.filter(id => id !== domainId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            domain_id: domainId
          });

        if (error) throw error;
        
        setFavoriteDomainsIds(prev => [...prev, domainId]);
      }
      
      refetchFavorites();
    } catch (error: any) {
      toast({
        title: "操作失败",
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
    setValue('sale_type', domain.sale_type || 'both');
    setValue('minimum_offer', domain.minimum_offer || Math.floor(domain.price * 0.8));
    setValue('keywords', domain.keywords ? domain.keywords.join(', ') : '');
    setValue('meta_title', domain.meta_title || '');
    setValue('meta_description', domain.meta_description || '');
    setEditDomainOpen(true);
  };

  const handleDeleteClick = (domain: any) => {
    setSelectedDomain(domain);
    setDeleteConfirmOpen(true);
  };

  const handleVerifyClick = (domain: any) => {
    setSelectedDomain(domain);
    setVerificationOpen(true);
  };

  const handleEditProfileClick = () => {
    if (profile) {
      setProfileEditOpen(true);
    }
  };

  const getDomainAnalytics = (domainId: string) => {
    if (!domainAnalytics) return { views: 0, offers: 0, favorites: 0 };
    const analytics = domainAnalytics.find((a: any) => a.domain_id === domainId);
    return analytics || { views: 0, offers: 0, favorites: 0 };
  };

  const renderOverview = () => {
    const totalDomains = myDomains?.length || 0;
    const availableDomains = myDomains?.filter((d: any) => d.status === 'available').length || 0;
    const soldDomains = myDomains?.filter((d: any) => d.status === 'sold').length || 0;
    
    return (
      <div className="space-y-6">
        {/* Profile overview */}
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{profile?.full_name || '未设置名称'}</h2>
                <p className="text-gray-300">{profile?.bio || '您尚未添加个人简介'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={profile?.is_seller ? (profile?.seller_verified ? 'bg-green-600' : 'bg-yellow-600') : 'bg-gray-600'}>
                    {profile?.is_seller ? (profile?.seller_verified ? '已认证卖家' : '卖家(未认证)') : '买家'}
                  </Badge>
                  {profile?.total_sales > 0 && (
                    <Badge className="bg-blue-600">已售: {profile?.total_sales}个域名</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEditProfileClick}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              编辑资料
            </Button>
          </div>
        </Card>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm">我的域名</h3>
                <p className="text-3xl font-bold text-white mt-1">{totalDomains}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge className="bg-green-600">{availableDomains} 可售</Badge>
              <Badge className="bg-blue-600">{soldDomains} 已售</Badge>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm">总收入</h3>
                <p className="text-3xl font-bold text-white mt-1">$0</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <Progress value={0} className="h-2 mt-4" />
            <p className="text-xs text-gray-400 mt-1">完成目标: 0%</p>
          </Card>
          
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm">卖家信誉</h3>
                <p className="text-3xl font-bold text-white mt-1">{profile?.seller_rating || '暂无'}</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge className={profile?.is_seller ? (profile?.seller_verified ? 'bg-green-600' : 'bg-yellow-600') : 'bg-gray-600'}>
                {profile?.is_seller ? (profile?.seller_verified ? '已验证' : '待验证') : '非卖家'}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <Card className="p-6 bg-white/5 border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">近期活动</h2>
          {totalDomains > 0 ? (
            <div className="space-y-3">
              {myDomains?.slice(0, 3).map((domain: any) => (
                <div key={domain.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">{domain.name}</p>
                      <p className="text-sm text-gray-400">添加于 {new Date(domain.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={domain.status === 'available' ? 'bg-green-600' : 'bg-blue-600'}>
                      {domain.status === 'available' ? '可售' : '已售'}
                    </Badge>
                    <span className="font-semibold text-blue-400">${domain.price}</span>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => setActiveView('domains')}>
                查看全部域名
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-3">您尚未添加任何域名</p>
              <Button onClick={() => setAddDomainOpen(true)} className="bg-blue-600">
                <ListPlus className="mr-2 h-4 w-4" />
                添加域名
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderDomains = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">我的域名</h2>
          <Button 
            onClick={() => setAddDomainOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
          >
            <ListPlus className="mr-2 h-4 w-4" />
            添加域名
          </Button>
        </div>
        
        {myDomains && myDomains.length > 0 ? (
          <div className="space-y-4">
            {myDomains.map((domain: any) => {
              const analytics = getDomainAnalytics(domain.id);
              
              return (
                <Card key={domain.id} className="bg-white/5 border-white/10 overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-medium text-white">{domain.name}</h3>
                        <Badge className={domain.status === 'available' ? 'bg-green-600' : 'bg-blue-600'}>
                          {domain.status === 'available' ? '可售' : '已售'}
                        </Badge>
                        {domain.is_featured && (
                          <Badge className="bg-amber-600">精选</Badge>
                        )}
                        {domain.verification_status === 'verified' && (
                          <Badge className="bg-teal-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            已验证
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{domain.description || '无描述'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {domain.category && (
                          <Badge variant="outline" className="border-gray-700 text-gray-300">
                            {domain.category}
                          </Badge>
                        )}
                        {domain.keywords && domain.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-400">${domain.price.toLocaleString()}</div>
                      {domain.minimum_offer && (
                        <div className="text-sm text-gray-400">最低出价: ${domain.minimum_offer.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="p-4 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-6 w-full md:w-auto">
                      <div className="text-center">
                        <p className="text-sm text-gray-400">流量</p>
                        <p className="font-semibold text-white">{analytics.views}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">报价</p>
                        <p className="font-semibold text-white">{analytics.offers}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">收藏</p>
                        <p className="font-semibold text-white">{analytics.favorites}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => handleVerifyClick(domain)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        验证
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(domain)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(domain)}
                        className="border-red-900 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">您还没有添加域名</p>
            <Button 
              onClick={() => setAddDomainOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500"
            >
              添加域名
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">账户设置</h2>
        
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">个人信息</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">用户名</label>
                <Input 
                  value={profile?.full_name || ''} 
                  readOnly
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">邮箱</label>
                <Input 
                  value={profile?.contact_email || '未设置'} 
                  readOnly
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">个人简介</label>
              <Textarea 
                value={profile?.bio || '未设置'} 
                readOnly
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            
            <Button 
              onClick={handleEditProfileClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              编辑个人资料
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">卖家设置</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-base font-medium text-white">卖家账号</div>
                <div className="text-sm text-gray-400">启用后可以出售域名</div>
              </div>
              <Switch 
                checked={profile?.is_seller || false}
                disabled
  
                className="bg-gray-800 data-[state=checked]:bg-blue-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-base font-medium text-white">卖家验证</div>
                <div className="text-sm text-gray-400">提高信誉度和交易安全性</div>
              </div>
              <Badge className={profile?.seller_verified ? 'bg-green-600' : 'bg-yellow-600'}>
                {profile?.seller_verified ? '已验证' : '未验证'}
              </Badge>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={profile?.seller_verified}
            >
              <Shield className="mr-2 h-4 w-4" />
              申请卖家验证
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">通知设置</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-white" htmlFor="email_notifications">
                邮件通知
              </label>
              <Switch 
                id="email_notifications" 
                defaultChecked={true}
                className="bg-gray-800 data-[state=checked]:bg-blue-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-white" htmlFor="offer_notifications">
                收到报价通知
              </label>
              <Switch 
                id="offer_notifications" 
                defaultChecked={true}
                className="bg-gray-800 data-[state=checked]:bg-blue-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-white" htmlFor="purchase_notifications">
                交易成功通知
              </label>
              <Switch 
                id="purchase_notifications" 
                defaultChecked={true}
                className="bg-gray-800 data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">用户中心</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="space-y-1">
                <Button
                  variant={activeView === 'overview' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('overview')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  概览
                </Button>
                <Button
                  variant={activeView === 'domains' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'domains' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('domains')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  我的域名
                </Button>
                <Button
                  variant={activeView === 'purchases' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'purchases' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('purchases')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  购买记录
                </Button>
                <Button
                  variant={activeView === 'sales' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'sales' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('sales')}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  销售记录
                </Button>
                <Button
                  variant={activeView === 'offers' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'offers' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('offers')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  我的报价
                </Button>
                <Button
                  variant={activeView === 'settings' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeView === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveView('settings')}
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  账户设置
                </Button>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="rounded-lg bg-blue-900/20 p-4 border border-blue-800/30">
                <h3 className="font-medium text-blue-300 flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  卖家状态
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">验证状态</span>
                    <Badge className={profile?.seller_verified ? 'bg-green-600' : 'bg-yellow-600'}>
                      {profile?.seller_verified ? '已验证' : '未验证'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">完成交易</span>
                    <span className="text-white">{profile?.total_sales || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">信誉评分</span>
                    <span className="text-white">{profile?.seller_rating || '暂无'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {activeView === 'overview' && renderOverview()}
            {activeView === 'domains' && renderDomains()}
            {activeView === 'purchases' && (
              <Card className="p-6 bg-white/5 border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">购买记录</h2>
                <PurchaseHistory />
              </Card>
            )}
            {activeView === 'sales' && (
              <Card className="p-6 bg-white/5 border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">销售记录</h2>
                <DomainSalesList />
              </Card>
            )}
            {activeView === 'offers' && (
              <Card className="p-6 bg-white/5 border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">我的报价</h2>
                <OfferList />
              </Card>
            )}
            {activeView === 'settings' && renderSettings()}
          </div>
        </div>
      </main>

      {/* 添加域名对话框 */}
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">添加域名</DialogTitle>
            <DialogDescription className="text-gray-300">
              填写域名信息，添加到域名市场进行销售
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onAddDomain)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">分类</label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="standard">标准域名</SelectItem>
                    <SelectItem value="premium">精品域名</SelectItem>
                    <SelectItem value="business">商业域名</SelectItem>
                    <SelectItem value="numeric">数字域名</SelectItem>
                    <SelectItem value="short">短域名</SelectItem>
                    <SelectItem value="brandable">品牌域名</SelectItem>
                    <SelectItem value="keyword">关键词域名</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">销售类型</label>
                <Select onValueChange={(value) => setValue('sale_type', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="选择销售类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="both">一口价和报价</SelectItem>
                    <SelectItem value="fixed">仅一口价</SelectItem>
                    <SelectItem value="offer">仅接受报价</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">关键词 (用逗号分隔)</label>
                <Input
                  {...register('keywords')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="关键词1, 关键词2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">最低接受报价 (USD)</label>
                <Input
                  {...register('minimum_offer')}
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="800"
                />
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">Meta 标题</label>
                <Input
                  {...register('meta_title')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO 标题"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">Meta 描述</label>
                <Input
                  {...register('meta_description')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO 描述"
                />
              </div>
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
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">编辑域名</DialogTitle>
            <DialogDescription className="text-gray-300">
              修改域名信息
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit(onEditDomain)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">分类</label>
                <Select 
                  defaultValue={selectedDomain?.category || "standard"}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="standard">标准域名</SelectItem>
                    <SelectItem value="premium">精品域名</SelectItem>
                    <SelectItem value="business">商业域名</SelectItem>
                    <SelectItem value="numeric">数字域名</SelectItem>
                    <SelectItem value="short">短域名</SelectItem>
                    <SelectItem value="brandable">品牌域名</SelectItem>
                    <SelectItem value="keyword">关键词域名</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">销售类型</label>
                <Select 
                  defaultValue={selectedDomain?.sale_type || "both"}
                  onValueChange={(value) => setValue('sale_type', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="选择销售类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="both">一口价和报价</SelectItem>
                    <SelectItem value="fixed">仅一口价</SelectItem>
                    <SelectItem value="offer">仅接受报价</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">关键词 (用逗号分隔)</label>
                <Input
                  {...registerEdit('keywords')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="关键词1, 关键词2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">最低接受报价 (USD)</label>
                <Input
                  {...registerEdit('minimum_offer')}
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="800"
                />
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">Meta 标题</label>
                <Input
                  {...registerEdit('meta_title')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO 标题"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-200 mb-1 block">Meta 描述</label>
                <Input
                  {...registerEdit('meta_description')}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO 描述"
                />
              </div>
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

      {/* 域名验证对话框 */}
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              域名所有权验证
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              验证您对域名 <span className="text-white font-medium">{selectedDomain?.name}</span> 的所有权
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitVerification(onVerifyDomain)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">验证方式</label>
              <Select 
                onValueChange={setVerificationType}
                defaultValue="dns"
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="选择验证方式" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="dns">DNS TXT 记录验证</SelectItem>
                  <SelectItem value="html">HTML 文件验证</SelectItem>
                  <SelectItem value="whois">WHOIS 记录验证</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/30">
              <h4 className="text-white font-medium mb-2">验证说明</h4>
              <p className="text-sm text-blue-200 mb-3">
                请添加以下 TXT 记录到您的域名 DNS 设置中，验证您的域名所有权：
              </p>
              <div className="bg-gray-900 p-3 rounded-md flex justify-between items-center">
                <code className="text-green-400 text-sm">verify-domain-ownership={selectedDomain?.id?.slice(0, 8)}</code>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(`verify-domain-ownership=${selectedDomain?.id?.slice(0, 8)}`);
                    toast({
                      title: "已复制到剪贴板",
                      duration: 2000,
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">验证值</label>
              <Input
                {...registerVerification('verification_value', { required: true })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="验证完成后输入 'confirm'"
              />
              {verificationErrors.verification_value && (
                <p className="text-red-400 text-sm mt-1">请输入验证值</p>
              )}
            </div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setVerificationOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                取消
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                提交验证
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 编辑个人资料对话框 */}
      <Dialog open={profileEditOpen} onOpenChange={setProfileEditOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-blue-400" />
              编辑个人资料
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              更新您的个人资料信息
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">姓名</label>
              <Input
                {...registerProfile('full_name')}
                defaultValue={profile?.full_name || ''}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="您的姓名"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">联系邮箱</label>
              <Input
                {...registerProfile('contact_email')}
                defaultValue={profile?.contact_email || ''}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="您的联系邮箱"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">联系电话</label>
              <Input
                {...registerProfile('contact_phone')}
                defaultValue={profile?.contact_phone || ''}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="您的联系电话"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">公司名称</label>
              <Input
                {...registerProfile('company_name')}
                defaultValue={profile?.company_name || ''}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="您的公司名称（可选）"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">个人简介</label>
              <Textarea
                {...registerProfile('bio')}
                defaultValue={profile?.bio || ''}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="请简短介绍一下您自己"
                rows={3}
              />
            </div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setProfileEditOpen(false)}
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
    </div>
  );
};

export default Dashboard;
