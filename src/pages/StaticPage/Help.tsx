import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">帮助中心</h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white">如何购买域名？</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                1. 浏览并选择您感兴趣的域名<br />
                2. 点击"立即购买"按钮<br />
                3. 完成支付流程<br />
                4. 等待域名转移确认
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-white">支持哪些支付方式？</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                我们目前支持多种支付方式，包括信用卡、PayPal等主流支付方式。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-white">域名转移需要多长时间？</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                域名转移通常需要3-7个工作日完成。具体时间可能因域名注册商而异。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-white">如何联系客服？</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                您可以通过以下方式联系我们：<br />
                - 电子邮件：support@example.com<br />
                - WhatsApp<br />
                - Telegram<br />
                我们的客服团队会在24小时内回复您的询问。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;