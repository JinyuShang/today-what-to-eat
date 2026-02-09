/**
 * HeroSection 组件
 * 主页面的 Hero 区域
 */

import { ReactNode, memo } from 'react';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  ingredientsCount: number;
  matchedRecipesCount: number;
  canCookCount: number;
}

export const HeroSection = memo(function HeroSection({
  ingredientsCount,
  matchedRecipesCount,
  canCookCount,
}: HeroSectionProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        打开冰箱，<span className="text-orange-500">不知道做什么？</span>
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        输入你现有的食材，AI 智能推荐可用菜谱 🍳
      </p>
      {ingredientsCount > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          找到 {matchedRecipesCount} 道菜谱 · {canCookCount} 道现在就能做
        </div>
      )}
    </div>
  );
});

/**
 * 性能优化说明：
 * - 使用 React.memo 避免不必要的重渲染
 * - props 均为原始类型（number），比较开销小
 * - 静态内容不会频繁变化
 */
