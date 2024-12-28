import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Globe } from 'lucide-react';
import DomainForm from './DomainForm';

interface Domain {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string;
  status: 'available' | 'sold' | 'reserved';
  is_featured: boolean;
}

interface DomainListProps {
  domains: Domain[];
}

const DomainList = ({ domains }: DomainListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null);

  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: "删除成功",
        description: "域名已成功删除",
      });
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDelete = (domain: Domain) => {
    if (window.confirm(`确定要删除域名 ${domain.name} 吗？`)) {
      deleteDomainMutation.mutate(domain.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">已售出</Badge>;
      case 'reserved':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">已预订</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">可购买</Badge>;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="grid gap-4">
          {domains?.map((domain) => (
            <div
              key={domain.id}
              className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">{domain.name}</h3>
                  {domain.is_featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      精选
                    </Badge>
                  )}
                  <Badge variant={domain.category === 'premium' ? 'default' : 'secondary'}>
                    {domain.category === 'premium' ? '精品域名' : domain.category === 'business' ? '商业域名' : '一口价域名'}
                  </Badge>
                  {getStatusBadge(domain.status)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {domain.description || "暂无描述"}
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ${domain.price}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDomain(domain)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  编辑
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(domain)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!editingDomain} onOpenChange={() => setEditingDomain(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑域名: {editingDomain?.name}</DialogTitle>
          </DialogHeader>
          {editingDomain && (
            <DomainForm
              mode="edit"
              initialData={editingDomain}
              onSuccess={() => setEditingDomain(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DomainList;