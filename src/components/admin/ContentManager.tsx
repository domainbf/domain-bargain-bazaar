import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'html';
}

const ContentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');

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

  const handleEdit = (setting: SiteSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
  };

  const handleSave = async (id: string) => {
    await updateMutation.mutate({ id, value: editValue });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">网站内容管理</h2>
      <div className="grid gap-4">
        {settings?.map((setting) => (
          <div key={setting.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{setting.key}</h3>
                <p className="text-sm text-gray-500">{setting.type}</p>
              </div>
              {editingId === setting.id ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(setting.id)}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    取消
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(setting)}
                  className="flex items-center gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  编辑
                </Button>
              )}
            </div>
            {editingId === setting.id ? (
              setting.type === 'html' ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[100px]"
                />
              ) : (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              )
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap">
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