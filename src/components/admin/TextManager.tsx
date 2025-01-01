import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TextManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: textSettings, isLoading } = useQuery({
    queryKey: ['site-text-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('type', 'text');
      
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
      queryClient.invalidateQueries({ queryKey: ['site-text-settings'] });
      toast({
        title: "更新成功",
        description: "网站文字已更新",
      });
    }
  });

  const handleUpdate = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">网站文字管理</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">标识符</TableHead>
            <TableHead className="text-white">当前文字</TableHead>
            <TableHead className="text-white w-[150px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {textSettings?.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="text-gray-300">{setting.key}</TableCell>
              <TableCell>
                <Input
                  defaultValue={setting.value}
                  onBlur={(e) => handleUpdate(setting.key, e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(setting.key, setting.value)}
                  className="w-full"
                >
                  保存
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TextManager;