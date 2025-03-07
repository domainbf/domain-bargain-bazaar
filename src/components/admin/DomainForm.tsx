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
    status: initialData?.status || 'available'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase
          .from('domains')
          .update(data)
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('domains')
          .insert([data]);
        
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
        status: 'available'
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