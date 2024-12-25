import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Users, Rocket, Heart, Brain } from 'lucide-react';

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2a2d4a]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 bg-black/40 backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <Users className="h-8 w-8" />
            加入我们
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Rocket className="h-6 w-6 text-purple-400" />
                为什么选择我们？
              </h2>
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">创新的工作环境</h3>
                  <p className="text-gray-300">
                    我们提供现代化的办公环境，鼓励创新思维，支持员工实现自己的想法。灵活的工作时间和地点，让您能够更好地平衡工作与生活。
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">职业发展机会</h3>
                  <p className="text-gray-300">
                    完善的培训体系，定期的技能提升课程，清晰的晋升通道，帮助您在职业道路上不断进步。
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">有竞争力的薪酬福利</h3>
                  <p className="text-gray-300">
                    具有市场竞争力的薪资待遇，完善的五险一金，年度体检，带薪年假等福利政策。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-400" />
                我们的文化
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                我们崇尚开放、创新、协作的企业文化。我们相信，只有快乐的员工才能创造出优秀的产品和服务。在这里，您将遇到一群充满激情的同事，共同为用户创造价值。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-400" />
                开放职位
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">高级前端开发工程师</h3>
                  <p className="text-gray-300 mb-4">
                    负责公司核心产品的前端开发工作，包括新功能开发、性能优化等。
                  </p>
                  <p className="text-sm text-gray-400">
                    工作地点：远程办公 | 全职
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">域名运营专员</h3>
                  <p className="text-gray-300 mb-4">
                    负责域名市场分析、域名价值评估、客户需求对接等工作。
                  </p>
                  <p className="text-sm text-gray-400">
                    工作地点：远程办公 | 全职
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default JoinUs;