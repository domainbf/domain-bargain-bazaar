import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const News = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <Newspaper className="h-8 w-8" />
            新闻资讯
          </h1>
          
          <div className="space-y-6">
            {[
              {
                date: '2024-03-15',
                title: '域名交易平台全新升级',
                content: '为了提供更好的用户体验，我们的平台进行了全面升级。新版本带来了更快的响应速度、更安全的交易保障，以及更直观的用户界面。',
                tag: '平台动态'
              },
              {
                date: '2024-03-10',
                title: '关于域名交易安全的重要提醒',
                content: '随着域名交易市场的快速发展，我们提醒用户注意交易安全，建议通过平台进行担保交易，避免私下交易可能带来的风险。',
                tag: '安全提醒'
              },
              {
                date: '2024-03-05',
                title: '2024年域名市场趋势分析',
                content: '根据最新市场数据显示，短域名和新顶级域名的需求持续增长。特别是在科技、金融等领域，优质域名的价值不断提升。',
                tag: '市场分析'
              }
            ].map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{news.date}</span>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    {news.tag}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{news.title}</h2>
                <p className="text-gray-300 mb-4">{news.content}</p>
                <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                  阅读更多 <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default News;