import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const Navigation = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Domain Bazaar
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link
              to="/domains"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Browse
            </Link>
            <Link
              to="/categories"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Categories
            </Link>
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;