import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/admin/LoginForm';
import DomainForm from '@/components/admin/DomainForm';
import DomainList from '@/components/admin/DomainList';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Domain Management</h1>
      <DomainForm onSuccess={() => {}} />
      <DomainList domains={domains || []} />
    </div>
  );
};

export default Admin;