'use client';

import { useState } from 'react';
import { Clock, ChefHat, Heart, Plus, BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { MatchedRecipe, DIFFICULTY_TEXT, CATEGORY_TEXT } from '@/types';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: MatchedRecipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToShopping: (recipe: MatchedRecipe) => void;
  onView?: (id: string) => void;
  inMenu?: boolean; // 新增：是否已在菜单中
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onAddToShopping, onView, inMenu }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const matchPercentage = Math.round(recipe.matchScore * 100);
  const matchColor = matchPercentage >= 80 ? 'bg-green-500' : matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500';

  const handleAddToMenu = () => {
    onAddToShopping(recipe);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-orange-100 overflow-hidden">
      {/* 内容区域 */}
      <div className="p-5 space-y-4">
        {/* 标题和匹配度 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{recipe.name}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(recipe.time)}
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                {DIFFICULTY_TEXT[recipe.difficulty]}
              </div>
            </div>
          </div>
          {/* 收藏按钮（所有菜谱都有） */}
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className={cn(
              "p-2 rounded-full transition-all",
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? '收起做法' : '查看做法'}
          </button>
          <button
            onClick={handleAddToMenu}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors",
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
          <div className="space-y-3 animate-fadeIn pt-3 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900">做法步骤：</h4>
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
