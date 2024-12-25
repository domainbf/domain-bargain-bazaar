import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">关于我们</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              我们是一家专注于域名交易的创新平台，致力于为用户提供安全、便捷、高效的域名交易服务。
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">我们的使命</h2>
            <p className="text-gray-300 mb-6">
              打造全球领先的域名交易生态系统，为每一个创业者、企业和个人用户提供优质的域名资源。
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">我们的优势</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>丰富的域名资源</li>
              <li>安全的交易保障</li>
              <li>专业的客户服务</li>
              <li>便捷的操作流程</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">联系我们</h2>
            <p className="text-gray-300">
              如果您有任何问题或建议，欢迎随时与我们联系。我们的客服团队将竭诚为您服务。
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;