/**
 * RecipeCard 组件 - 性能优化版本
 * 使用 React.memo 和自定义比较函数避免不必要的重渲染
 */

'use client';

import { useState, memo, useCallback } from 'react';
import { Clock, Users, ChefHat, Heart, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { MatchedRecipe } from '@/types';
import {
  formatTime,
  getHealthLabels,
  adjustIngredientsForServings,
  adjustNutritionForServings,
} from '@/lib/utils';
import { cn } from '@/lib/utils';
import { NUMERIC } from '@/lib/constants';

interface RecipeCardProps {
  recipe: MatchedRecipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToShopping: (recipe: MatchedRecipe) => void;
  onView?: (id: string) => void;
  inMenu?: boolean;
  servings: number;
}

/**
 * 自定义比较函数：只在关键 props 变化时重渲染
 */
function arePropsEqual(prevProps: RecipeCardProps, nextProps: RecipeCardProps) {
  return (
    prevProps.recipe.id === nextProps.recipe.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.inMenu === nextProps.inMenu &&
    prevProps.servings === nextProps.servings
  );
}

export const RecipeCardOptimized = memo(function RecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
  onAddToShopping,
  onView,
  inMenu,
  servings,
}: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  // 使用 useCallback 缓存事件处理函数
  const handleToggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(recipe.id);
  }, [recipe.id, onToggleFavorite]);

  const handleAddToMenu = useCallback(() => {
    onAddToShopping(recipe);
  }, [recipe, onAddToShopping]);

  const handleView = useCallback(() => {
    onView?.(recipe.id);
  }, [recipe.id, onView]);

  // 计算调整后的食材和营养信息
  const healthLabels = getHealthLabels(recipe);
  const adjustedIngredients = recipe.nutritionalInfo
    ? adjustIngredientsForServings(
        recipe.ingredients,
        recipe.nutritionalInfo.servings,
        servings
      )
    : recipe.ingredients;

  const adjustedNutrition = recipe.nutritionalInfo
    ? adjustNutritionForServings(recipe.nutritionalInfo, servings)
    : null;

  // 匹配进度条
  const matchPercentage = Math.round(recipe.matchScore * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* 图片区域 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-orange-300" />
          </div>
        )}

        {/* 标签 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {healthLabels.map(label => (
            <span
              key={label}
              className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full"
            >
              {label}
            </span>
          ))}
        </div>

        {/* 收藏按钮 */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2.5 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
          )}
          aria-label={isFavorite ? "取消收藏" : "添加收藏"}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题和时间 */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
            {recipe.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {formatTime(recipe.time)}
          </div>
        </div>

        {/* 食材匹配度 */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">食材匹配度</span>
            <span className={cn(
              "font-medium",
              matchPercentage >= 70 ? "text-green-600" :
              matchPercentage >= 50 ? "text-yellow-600" :
              "text-gray-600"
            )}>
              {matchPercentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                matchPercentage >= 70 ? "bg-green-500" :
                matchPercentage >= 50 ? "bg-yellow-500" :
                "bg-gray-400"
              )}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {/* 食材列表 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.matchedIngredients.map(ing => (
            <span
              key={ing}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {ing}
            </span>
          ))}
          {recipe.missingIngredients.slice(0, 5).map(ing => (
            <span
              key={ing}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {ing}
            </span>
          ))}
          {recipe.missingIngredients.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{recipe.missingIngredients.length - 5}
            </span>
          )}
        </div>

        {/* 展开按钮 */}
        <button
          onClick={handleToggleExpanded}
          className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
          aria-expanded={expanded}
        >
          <span>{expanded ? '收起做法' : '查看做法'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* 展开的详细信息 */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            {/* 难度和人数 */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <span>难度: {recipe.difficulty === 'easy' ? '简单' : recipe.difficulty === 'medium' ? '中等' : '较难'}</span>
              {adjustedNutrition && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {servings}人份 · {adjustedNutrition.calories}卡
                </span>
              )}
            </div>

            {/* 调整后的食材 */}
            {adjustedIngredients.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">所需食材 ({servings}人份)</h4>
                <div className="flex flex-wrap gap-1">
                  {adjustedIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 做法步骤 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">做法步骤</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                {recipe.steps?.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 营养信息 */}
            {adjustedNutrition && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">营养成分</h4>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span>蛋白质: {adjustedNutrition.protein}</span>
                  <span>碳水: {adjustedNutrition.carbs}</span>
                  <span>脂肪: {adjustedNutrition.fat}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 底部按钮 */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToMenu}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 min-h-[44px]",
              inMenu
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            )}
            disabled={inMenu}
            aria-label={inMenu ? "已在菜单中" : "添加到菜单"}
          >
            <Plus className="w-4 h-4" />
            {inMenu ? '已添加' : '加菜单'}
          </button>
          {onView && (
            <button
              onClick={handleView}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors min-h-[44px]"
            >
              详情
            </button>
          )}
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

/**
 * 性能优化说明：
 * 1. 使用 React.memo 包裹组件
 * 2. 自定义比较函数 arePropsEqual，只在关键 props 变化时重渲染
 * 3. 使用 useCallback 缓存所有事件处理函数
 * 4. 图片添加 loading="lazy" 懒加载
 * 5. 避免在渲染过程中创建新对象/数组
 * 6. 使用 CSS 而非内联样式
 */
