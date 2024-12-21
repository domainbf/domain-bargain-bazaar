import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Domain Bazaar
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Browse
            </Link>
            <Link
              to="/pricing"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              About
            </Link>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;