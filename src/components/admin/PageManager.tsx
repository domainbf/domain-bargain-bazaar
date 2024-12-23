import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Edit2, Save, X } from 'lucide-react';

const PageManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('pages')
        .update({ title, content })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      toast({
        title: "更新成功",
        description: "页面内容已更新",
      });
      setEditingId(null);
    }
  });

  const handleEdit = (page: any) => {
    setEditingId(page.id);
    setEditForm({ title: page.title, content: page.content });
  };

  const handleSave = async (id: string) => {
    await updateMutation.mutate({
      id,
      title: editForm.title,
      content: editForm.content
    });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">页面管理</h2>
      <div className="grid gap-4">
        {pages?.map((page) => (
          <Card key={page.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">{page.title}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
              {editingId === page.id ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(page.id)}
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
                  onClick={() => handleEdit(page)}
                  className="flex items-center gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  编辑
                </Button>
              )}
            </div>
            {editingId === page.id ? (
              <div className="space-y-4">
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="页面标题"
                />
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="页面内容 (支持 Markdown)"
                  className="min-h-[200px]"
                />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="max-h-40 overflow-y-auto">
                  {page.content}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageManager;