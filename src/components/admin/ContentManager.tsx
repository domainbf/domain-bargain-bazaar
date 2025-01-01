import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'html' | 'link';
}

const ContentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [newSetting, setNewSetting] = React.useState({
    key: '',
    value: '',
    type: 'text'
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "更新成功",
        description: "网站内容已更新",
      });
      setEditingId(null);
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: { key: string; value: string; type: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "创建成功",
        description: "新的内容设置已添加",
      });
      setNewSetting({ key: '', value: '', type: 'text' });
    }
  });

  const handleSave = async (id: string) => {
    await updateMutation.mutate({ id, value: editValue });
  };

  const handleCreate = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast({
        title: "错误",
        description: "请填写完整信息",
        variant: "destructive",
      });
      return;
    }
    await createMutation.mutate(newSetting);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">添加新内容</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="键名（例如：site_title）"
              value={newSetting.key}
              onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
            />
            <Select
              value={newSetting.type}
              onValueChange={(value) => setNewSetting(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">文本</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="image">图片</SelectItem>
                <SelectItem value="link">链接</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加
            </Button>
          </div>
          <Textarea
            placeholder="内容值"
            value={newSetting.value}
            onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {settings?.map((setting) => (
          <div key={setting.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-white">{setting.key}</h3>
                <p className="text-sm text-gray-400">{setting.type}</p>
              </div>
              {editingId === setting.id ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(setting.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    取消
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(setting.id);
                    setEditValue(setting.value);
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  编辑
                </Button>
              )}
            </div>
            {editingId === setting.id ? (
              setting.type === 'html' ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[100px] bg-white/10 border-white/20 text-white"
                />
              ) : (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              )
            ) : (
              <div className="text-gray-300 whitespace-pre-wrap">
                {setting.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;