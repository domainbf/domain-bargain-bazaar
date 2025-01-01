import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DomainFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    is_featured: boolean;
    status: string;
    registration_date?: string;
    expiry_date?: string;
    registrar?: string;
    minimum_offer?: number;
    buy_now_price?: number;
    meta_title?: string;
    meta_description?: string;
    featured_rank?: number;
    keywords?: string[];
  };
  mode?: 'create' | 'edit';
}

const DomainForm = ({ onSuccess, initialData, mode = 'create' }: DomainFormProps) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    category: initialData?.category || 'standard',
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'available',
    registration_date: initialData?.registration_date ? new Date(initialData.registration_date) : undefined,
    expiry_date: initialData?.expiry_date ? new Date(initialData.expiry_date) : undefined,
    registrar: initialData?.registrar || '',
    minimum_offer: initialData?.minimum_offer || '',
    buy_now_price: initialData?.buy_now_price || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    featured_rank: initialData?.featured_rank || '',
    keywords: initialData?.keywords?.join(', ') || '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const domainData = {
        name: data.name,
        price: parseFloat(data.price as string),
        description: data.description,
        category: data.category,
        is_featured: data.is_featured,
        status: data.status,
        registration_date: data.registration_date,
        expiry_date: data.expiry_date,
        registrar: data.registrar,
        minimum_offer: data.minimum_offer ? parseFloat(data.minimum_offer as string) : null,
        buy_now_price: data.buy_now_price ? parseFloat(data.buy_now_price as string) : null,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        featured_rank: data.featured_rank ? parseInt(data.featured_rank as string) : null,
        keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()) : null,
      };

      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase
          .from('domains')
          .update(domainData)
          .eq('id', initialData.id);
        
        if (error) throw error;

        // Record history
        const { error: historyError } = await supabase
          .from('domain_history')
          .insert({
            domain_id: initialData.id,
            action: 'update',
            previous_status: initialData.status,
            new_status: data.status,
            price_change: parseFloat(data.price as string) - initialData.price,
          });

        if (historyError) console.error('History recording error:', historyError);
      } else {
        const { error } = await supabase
          .from('domains')
          .insert([domainData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      queryClient.invalidateQueries({ queryKey: ['featured-domains'] });
      toast({
        title: mode === 'create' ? "域名添加成功" : "域名更新成功",
        description: mode === 'create' ? "新域名已成功添加到系统" : "域名信息已成功更新",
      });
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'standard',
        is_featured: false,
        status: 'available',
        registration_date: undefined,
        expiry_date: undefined,
        registrar: '',
        minimum_offer: '',
        buy_now_price: '',
        meta_title: '',
        meta_description: '',
        featured_rank: '',
        keywords: '',
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">域名</Label>
          <Input
            id="name"
            placeholder="example.com"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">价格</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="99.99"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          placeholder="域名描述..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">类别</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
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

        <div className="space-y-2">
          <Label htmlFor="status">状态</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">可购买</SelectItem>
              <SelectItem value="sold">已售出</SelectItem>
              <SelectItem value="reserved">已预订</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="expired">已过期</SelectItem>
              <SelectItem value="premium">高级域名</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>注册日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.registration_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.registration_date ? format(formData.registration_date, "PPP") : <span>选择日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.registration_date}
                onSelect={(date) => setFormData(prev => ({ ...prev, registration_date: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>到期日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.expiry_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expiry_date ? format(formData.expiry_date, "PPP") : <span>选择日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.expiry_date}
                onSelect={(date) => setFormData(prev => ({ ...prev, expiry_date: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="registrar">注册商</Label>
          <Input
            id="registrar"
            placeholder="域名注册商"
            value={formData.registrar}
            onChange={(e) => setFormData(prev => ({ ...prev, registrar: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featured_rank">精选排序</Label>
          <Input
            id="featured_rank"
            type="number"
            placeholder="精选域名排序"
            value={formData.featured_rank}
            onChange={(e) => setFormData(prev => ({ ...prev, featured_rank: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minimum_offer">最低报价</Label>
          <Input
            id="minimum_offer"
            type="number"
            step="0.01"
            placeholder="最低接受报价"
            value={formData.minimum_offer}
            onChange={(e) => setFormData(prev => ({ ...prev, minimum_offer: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buy_now_price">一口价</Label>
          <Input
            id="buy_now_price"
            type="number"
            step="0.01"
            placeholder="立即购买价格"
            value={formData.buy_now_price}
            onChange={(e) => setFormData(prev => ({ ...prev, buy_now_price: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">关键词</Label>
        <Input
          id="keywords"
          placeholder="关键词（用逗号分隔）"
          value={formData.keywords}
          onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_title">Meta 标题</Label>
        <Input
          id="meta_title"
          placeholder="SEO 标题"
          value={formData.meta_title}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description">Meta 描述</Label>
        <Textarea
          id="meta_description"
          placeholder="SEO 描述"
          value={formData.meta_description}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
        />
        <Label htmlFor="is_featured">设为精选域名</Label>
      </div>

      <Button type="submit" className="w-full">
        {mode === 'create' ? '添加域名' : '更新域名'}
      </Button>
    </form>
  );
};

export default DomainForm;