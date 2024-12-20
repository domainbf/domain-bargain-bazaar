import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'sold';
}

interface DomainListProps {
  domains: Domain[];
}

const DomainList = ({ domains }: DomainListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'available' | 'sold' }) => {
      const { error } = await supabase
        .from('domains')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: "Success",
        description: "Domain status updated",
      });
    }
  });

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
        title: "Success",
        description: "Domain deleted successfully",
      });
    }
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {domains?.map((domain) => (
          <li key={domain.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-gray-900">{domain.name}</p>
              <p className="text-sm text-gray-500">${domain.price}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => updateStatusMutation.mutate({
                  id: domain.id,
                  status: domain.status === 'available' ? 'sold' : 'available'
                })}
              >
                Mark as {domain.status === 'available' ? 'Sold' : 'Available'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this domain?')) {
                    deleteDomainMutation.mutate(domain.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DomainList;