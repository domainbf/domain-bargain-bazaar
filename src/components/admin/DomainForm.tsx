import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DomainFormProps {
  onSuccess: () => void;
}

const DomainForm = ({ onSuccess }: DomainFormProps) => {
  const [newDomain, setNewDomain] = React.useState({ name: '', price: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      onSuccess();
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

  return (
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
  );
};

export default DomainForm;