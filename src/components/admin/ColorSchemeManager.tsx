import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ColorSchemeManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: colorSettings, isLoading } = useQuery({
    queryKey: ['site-color-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('type', 'color');
      
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-color-settings'] });
      toast({
        title: "更新成功",
        description: "颜色方案已更新",
      });
    }
  });

  const colorGroups = [
    {
      title: "主要颜色",
      description: "网站的主要颜色方案",
      colors: [
        { key: 'primary_color', label: '主色调' },
        { key: 'secondary_color', label: '次要色调' },
        { key: 'accent_color', label: '强调色' }
      ]
    },
    {
      title: "背景颜色",
      description: "网站的背景颜色设置",
      colors: [
        { key: 'background_color', label: '主背景色' },
        { key: 'card_background', label: '卡片背景' },
        { key: 'hover_background', label: '悬停背景' }
      ]
    },
    {
      title: "文字颜色",
      description: "网站的文字颜色设置",
      colors: [
        { key: 'text_primary', label: '主要文字' },
        { key: 'text_secondary', label: '次要文字' },
        { key: 'text_muted', label: '淡化文字' }
      ]
    }
  ];

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">颜色方案管理</h2>
      </div>

      <div className="grid gap-6">
        {colorGroups.map((group) => (
          <Card key={group.title} className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{group.title}</CardTitle>
              <CardDescription className="text-gray-300">
                {group.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {group.colors.map((color) => {
                  const setting = colorSettings?.find(s => s.key === color.key);
                  return (
                    <div key={color.key} className="flex items-center gap-4">
                      <label className="w-32 text-gray-300">{color.label}</label>
                      <div className="flex-1 flex gap-4">
                        <Input
                          type="color"
                          value={setting?.value || '#000000'}
                          onChange={(e) => updateMutation.mutate({
                            key: color.key,
                            value: e.target.value
                          })}
                          className="w-20 h-10 p-1 bg-white/10 border-white/20"
                        />
                        <Input
                          type="text"
                          value={setting?.value || '#000000'}
                          onChange={(e) => updateMutation.mutate({
                            key: color.key,
                            value: e.target.value
                          })}
                          className="flex-1 bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeManager;