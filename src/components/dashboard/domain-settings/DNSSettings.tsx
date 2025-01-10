import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { useToast } from '@/hooks/use-toast';

interface DNSSettingsProps {
  domainId: string;
}

const DNSSettings: React.FC<DNSSettingsProps> = ({ domainId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRecord, setNewRecord] = React.useState({
    type: 'A',
    name: '',
    value: '',
    priority: '',
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['dns-records', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dns_records')
        .select('*')
        .eq('domain_id', domainId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const addRecordMutation = useMutation({
    mutationFn: async (record: typeof newRecord) => {
      const { error } = await supabase
        .from('dns_records')
        .insert([{
          domain_id: domainId,
          type: record.type,
          name: record.name,
          value: record.value,
          priority: record.priority ? parseInt(record.priority) : null,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dns-records', domainId] });
      toast({
        title: "记录添加成功",
        description: "DNS记录已成功添加",
      });
      setNewRecord({ type: 'A', name: '', value: '', priority: '' });
    },
    onError: (error) => {
      toast({
        title: "添加失败",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <LoadingState message="加载DNS记录..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-4 gap-4">
          <Select
            value={newRecord.type}
            onValueChange={(value) => setNewRecord(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="记录类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="AAAA">AAAA</SelectItem>
              <SelectItem value="CNAME">CNAME</SelectItem>
              <SelectItem value="MX">MX</SelectItem>
              <SelectItem value="TXT">TXT</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="名称"
            value={newRecord.name}
            onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Input
            placeholder="值"
            value={newRecord.value}
            onChange={(e) => setNewRecord(prev => ({ ...prev, value: e.target.value }))}
          />
          
          {newRecord.type === 'MX' && (
            <Input
              type="number"
              placeholder="优先级"
              value={newRecord.priority}
              onChange={(e) => setNewRecord(prev => ({ ...prev, priority: e.target.value }))}
            />
          )}
          
          <Button 
            onClick={() => addRecordMutation.mutate(newRecord)}
            disabled={addRecordMutation.isPending}
          >
            添加记录
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {records?.map((record) => (
          <div 
            key={record.id}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg"
          >
            <div className="grid grid-cols-4 gap-4 flex-1">
              <span className="text-sm font-medium text-white">{record.type}</span>
              <span className="text-sm text-gray-400">{record.name}</span>
              <span className="text-sm text-gray-400">{record.value}</span>
              {record.type === 'MX' && (
                <span className="text-sm text-gray-400">
                  优先级: {record.priority}
                </span>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                const { error } = await supabase
                  .from('dns_records')
                  .delete()
                  .eq('id', record.id);
                
                if (error) {
                  toast({
                    title: "删除失败",
                    description: error.message,
                    variant: "destructive",
                  });
                } else {
                  queryClient.invalidateQueries({ queryKey: ['dns-records', domainId] });
                  toast({
                    title: "记录删除成功",
                    description: "DNS记录已成功删除",
                  });
                }
              }}
            >
              删除
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DNSSettings;