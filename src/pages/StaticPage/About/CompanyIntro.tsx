import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Building2, Target, Award, Users } from 'lucide-react';

const CompanyIntro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            公司介绍
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-400" />
                我们的愿景
              </h2>
              <p className="text-gray-300 leading-relaxed">
                作为领先的域名交易平台，我们致力于为全球用户提供安全、便捷、高效的域名交易服务。我们相信，每个优质域名都承载着独特的价值和无限的可能性。通过我们的平台，我们希望帮助更多创业者、企业和个人找到完美的数字资产，为其在线业务发展保驾护航。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-400" />
                核心优势
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">安全保障</h3>
                  <p className="text-gray-300">
                    采用业界领先的安全技术，确保每笔交易的安全性。专业的托管服务，让买卖双方无后顾之忧。
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">专业服务</h3>
                  <p className="text-gray-300">
                    拥有经验丰富的域名专家团队，为用户提供专业的域名估值、交易咨询等服务。
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">便捷交易</h3>
                  <p className="text-gray-300">
                    简化的交易流程，支持多种支付方式，让域名交易变得轻松便捷。
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">资源丰富</h3>
                  <p className="text-gray-300">
                    拥有海量优质域名资源，覆盖各个行业领域，满足不同用户的需求。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-green-400" />
                我们的团队
              </h2>
              <p className="text-gray-300 leading-relaxed">
                我们的团队由来自互联网、金融、法律等不同领域的专业人士组成。团队成员平均拥有超过10年的域名行业经验，深谙域名交易的各个环节。我们始终秉持"专业、诚信、创新"的理念，为用户提供最优质的服务。
              </p>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyIntro;