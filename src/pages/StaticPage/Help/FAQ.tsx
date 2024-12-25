import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <HelpCircle className="h-8 w-8" />
            常见问题
          </h1>
          
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="bg-white/5 rounded-lg border-none">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                如何判断一个域名的价值？
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                域名价值主要取决于以下因素：<br />
                1. 域名长度：通常越短越有价值<br />
                2. 域名含义：与热门行业或通用词汇相关的域名更有价值<br />
                3. 后缀类型：.com等主流后缀通常更受欢迎<br />
                4. 品牌潜力：适合作为品牌名称的域名价值较高<br />
                5. 市场需求：特定行业或领域的需求度
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white/5 rounded-lg border-none">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                域名交易需要多长时间？
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                域名交易时间主要包括：<br />
                1. 支付确认：通常在24小时内<br />
                2. 域名转移：3-7个工作日，具体取决于注册商<br />
                3. 特殊情况可能需要更长时间，我们会及时通知您进展
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white/5 rounded-lg border-none">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                支持哪些支付方式？
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                我们支持多种支付方式：<br />
                1. 信用卡支付<br />
                2. PayPal<br />
                3. 银行转账<br />
                4. 其他第三方支付平台<br />
                具体支付方式会在结算时显示
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white/5 rounded-lg border-none">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                如何确保交易安全？
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                我们采取多重措施保障交易安全：<br />
                1. 实名认证系统<br />
                2. 担保交易模式<br />
                3. 资金托管服务<br />
                4. 专业的客服团队<br />
                5. 完整的交易记录和凭证
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white/5 rounded-lg border-none">
              <AccordionTrigger className="px-4 text-white hover:no-underline">
                域名交易后如何过户？
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                域名过户流程：<br />
                1. 确认付款后，卖家提供域名转移码<br />
                2. 买家在新注册商处提交转移申请<br />
                3. 等待域名注册商审核和转移<br />
                4. 转移完成后更新域名所有者信息
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;