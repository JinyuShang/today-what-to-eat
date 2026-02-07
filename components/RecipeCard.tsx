'use client';

import { useState } from 'react';
import { Clock, ChefHat, Heart, Plus, BookOpen, ChevronDown, ChevronUp, Check, Users, Flame } from 'lucide-react';
import { MatchedRecipe, DIFFICULTY_TEXT, CATEGORY_TEXT } from '@/types';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { getHealthLabels, adjustIngredientsForServings, adjustNutritionForServings } from '@/lib/recipe-enhancements';

interface RecipeCardProps {
  recipe: MatchedRecipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToShopping: (recipe: MatchedRecipe) => void;
  onView?: (id: string) => void;
  inMenu?: boolean; // 新增：是否已在菜单中
  servings: number; // 全局人数设置
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onAddToShopping, onView, inMenu, servings }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const matchPercentage = Math.round(recipe.matchScore * 100);
  const matchColor = matchPercentage >= 80 ? 'bg-green-500' : matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500';

  const healthLabels = getHealthLabels(recipe);

  // 根据人数调整食材
  const adjustedIngredients = recipe.nutritionalInfo
    ? adjustIngredientsForServings(
        recipe.ingredients,
        recipe.nutritionalInfo.servings,
        servings
      )
    : recipe.ingredients;

  // 根据人数调整营养信息
  const adjustedNutrition = recipe.nutritionalInfo
    ? adjustNutritionForServings(recipe.nutritionalInfo, recipe.nutritionalInfo.servings, servings)
    : null;

  const handleAddToMenu = () => {
    onAddToShopping(recipe);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-orange-100 overflow-hidden">
      {/* 内容区域 */}
      <div className="p-5 space-y-4">
        {/* 标题、健康标签和匹配度 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{recipe.name}</h3>
              {/* 健康标签 */}
              {healthLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {healthLabels.map(label => (
                    <span
                      key={label}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(recipe.time)}
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                {DIFFICULTY_TEXT[recipe.difficulty]}
              </div>
              {recipe.nutritionalInfo && adjustedNutrition && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="w-4 h-4" />
                  {adjustedNutrition.calories} 卡
                </div>
              )}
            </div>
          </div>
          {/* 收藏按钮（所有菜谱都有） */}
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className={cn(
              "p-2.5 md:p-2 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation",
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
            )}
            aria-label={isFavorite ? "取消收藏" : "添加收藏"}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current animate-heart")} />
          </button>
        </div>

        {/* 匹配进度条 */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", matchColor)}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>

          {/* 食材对比 */}
          {recipe.matchedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.matchedIngredients.map(ing => (
                <span key={ing} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  ✓ {ing}
                </span>
              ))}
              {recipe.missingIngredients.map(ing => (
                <span key={ing} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                  + {ing}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors min-h-[48px] touch-manipulation"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? '收起做法' : '查看做法'}
          </button>
          <button
            onClick={handleAddToMenu}
            className={cn(
              "relative flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl transition-colors min-h-[48px] min-w-[100px] touch-manipulation",
              showAdded || inMenu
                ? "bg-green-500 text-white cursor-default"
                : "bg-purple-500 text-white hover:bg-purple-600"
            )}
          >
            {showAdded || inMenu ? (
              <>
                <Check className="w-4 h-4" />
                已加入
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                加菜单
              </>
            )}
          </button>
        </div>

        {/* 展开的做法 */}
        {expanded && (
          <div className="space-y-4 animate-fadeIn pt-3 border-t border-gray-100">
            {/* 营养信息 */}
            {recipe.nutritionalInfo && adjustedNutrition && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">营养信息（{servings}人份）：</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-orange-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-orange-600">
                      {adjustedNutrition.calories}
                    </div>
                    <div className="text-xs text-gray-600">卡路里</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-600">{adjustedNutrition.protein}</div>
                    <div className="text-xs text-gray-600">蛋白质</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600">{adjustedNutrition.carbs}</div>
                    <div className="text-xs text-gray-600">碳水</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-yellow-600">{adjustedNutrition.fat}</div>
                    <div className="text-xs text-gray-600">脂肪</div>
                  </div>
                </div>
              </div>
            )}

            {/* 食材清单（调整后） */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">食材清单（{servings}人份）：</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {adjustedIngredients.map((ing, index) => (
                  <div key={index} className="text-gray-700">
                    • {ing}
                  </div>
                ))}
              </div>
            </div>

            {/* 做法步骤 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">做法步骤：</h4>
              <ol className="space-y-2">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {recipe.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
