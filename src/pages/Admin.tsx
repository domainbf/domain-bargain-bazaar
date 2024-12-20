import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newDomain, setNewDomain] = React.useState({ name: '', price: '' });

  const { data: domains, isLoading } = useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addDomainMutation = useMutation({
    mutationFn: async (domain: { name: string; price: number }) => {
      const { error } = await supabase
        .from('domains')
        .insert([domain]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast({
        title: "Success",
        description: "Domain added successfully",
      });
      setNewDomain({ name: '', price: '' });
    }
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newDomain.price);
    if (isNaN(price)) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    addDomainMutation.mutate({ name: newDomain.name, price });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Domain Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Domain name"
            value={newDomain.name}
            onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={newDomain.price}
            onChange={(e) => setNewDomain(prev => ({ ...prev, price: e.target.value }))}
            required
          />
          <Button type="submit">Add Domain</Button>
        </div>
      </form>

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
    </div>
  );
};

export default Admin;