import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Domain Market</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/domains" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                所有域名
              </Link>
              <Link to="/categories" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                域名分类
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="outline">登录</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;