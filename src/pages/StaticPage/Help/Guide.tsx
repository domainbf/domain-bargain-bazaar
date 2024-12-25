import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { BookOpen, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Guide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            使用指南
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">开始使用</h2>
              <div className="grid gap-4">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    注册账户
                  </h3>
                  <p className="text-gray-300">
                    点击右上角的"注册"按钮，填写必要信息完成账户注册。我们支持邮箱注册和社交账号快速登录。
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    实名认证
                  </h3>
                  <p className="text-gray-300">
                    为了保障交易安全，请在个人中心完成实名认证。认证通过后即可进行域名交易。
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    绑定支付方式
                  </h3>
                  <p className="text-gray-300">
                    在账户设置中绑定您的支付方式。我们支持多种支付渠道，确保交易便捷安全。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">交易流程</h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1" className="bg-white/5 rounded-lg border-none">
                  <AccordionTrigger className="px-4 text-white hover:no-underline">
                    如何购买域名？
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-300">
                    1. 在首页或搜索页面选择心仪的域名<br />
                    2. 点击"立即购买"按钮<br />
                    3. 确认订单信息并选择支付方式<br />
                    4. 完成支付后等待域名转移<br />
                    5. 域名转移完成后，您可以在个人中心查看域名状态
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/5 rounded-lg border-none">
                  <AccordionTrigger className="px-4 text-white hover:no-underline">
                    如何出售域名？
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-300">
                    1. 登录您的账户并完成实名认证<br />
                    2. 在个人中心点击"出售域名"<br />
                    3. 填写域名信息和价格<br />
                    4. 提交域名信息等待审核<br />
                    5. 审核通过后域名将在平台上架
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/5 rounded-lg border-none">
                  <AccordionTrigger className="px-4 text-white hover:no-underline">
                    域名交易安全保障
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-300">
                    1. 平台提供担保交易服务<br />
                    2. 资金先由平台托管<br />
                    3. 确认域名转移完成后再释放资金<br />
                    4. 全程有专业客服跟进<br />
                    5. 提供交易凭证和合同支持
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Guide;