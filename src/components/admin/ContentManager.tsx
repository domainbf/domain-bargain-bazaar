import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ContentForm from './content/ContentForm';
import ContentList from './content/ContentList';

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
        <ContentForm
          newSetting={newSetting}
          setNewSetting={setNewSetting}
          handleCreate={handleCreate}
        />
      </div>

      <ContentList
        settings={settings}
        editingId={editingId}
        editValue={editValue}
        setEditValue={setEditValue}
        setEditingId={setEditingId}
        handleSave={handleSave}
      />
    </div>
  );
};

export default ContentManager;