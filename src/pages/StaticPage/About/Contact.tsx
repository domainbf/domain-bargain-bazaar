import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <Mail className="h-8 w-8" />
            联系我们
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">电子邮件</h3>
                  <p className="text-gray-300">support@example.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">在线客服</h3>
                  <p className="text-gray-300">工作日 9:00-18:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-yellow-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">工作时间</h3>
                  <p className="text-gray-300">周一至周五: 9:00-18:00</p>
                  <p className="text-gray-300">周六至周日: 10:00-16:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-red-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">办公地址</h3>
                  <p className="text-gray-300">中国上海市浦东新区张江高科技园区</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">发送消息</h2>
              <ContactForm />
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">常见问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">如何购买域名？</h3>
                <p className="text-gray-300">
                  您可以直接在网站上浏览并选择心仪的域名，点击"购买"按钮即可开始交易流程。我们支持多种支付方式，确保交易安全便捷。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">域名转移需要多长时间？</h3>
                <p className="text-gray-300">
                  域名转移通常需要3-7个工作日完成。具体时间可能因域名注册商而异，我们会全程跟进转移进度。
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;