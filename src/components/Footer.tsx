import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">域名交易</h3>
            <p className="text-gray-600 text-sm">
              您值得信赖的优质域名交易平台。
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">关于我们</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">公司介绍</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">加入我们</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">联系方式</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">帮助中心</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">新闻资讯</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">使用指南</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">常见问题</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">关注我们</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} 域名交易平台. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;