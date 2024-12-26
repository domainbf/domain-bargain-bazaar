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
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase
          .from('domains')
          .update({
            name: data.name,
            price: parseFloat(data.price as string),
            description: data.description,
            category: data.category,
            is_featured: data.is_featured,
          })
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('domains')
          .insert([{
            name: data.name,
            price: parseFloat(data.price as string),
            description: data.description,
            category: data.category,
            is_featured: data.is_featured,
            status: 'available',
          }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
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
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price as string);
    if (isNaN(price)) {
      toast({
        title: "输入错误",
        description: "请输入有效的价格",
        variant: "destructive",
      });
      return;
    }
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
              <SelectItem value="standard">一口价域名</SelectItem>
              <SelectItem value="premium">精品域名</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}>
          </Switch>
          <Label htmlFor="is_featured">设为精选域名</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {mode === 'create' ? '添加域名' : '更新域名'}
      </Button>
    </form>
  );
};

export default DomainForm;