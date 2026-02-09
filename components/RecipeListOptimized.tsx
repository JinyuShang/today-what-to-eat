/**
 * RecipeList 组件 - 性能优化版本
 */

'use client';

import { memo, useMemo } from 'react';
import { RecipeCardOptimized } from './RecipeCardOptimized';
import { MatchedRecipe } from '@/types';

interface RecipeListProps {
  recipes: MatchedRecipe[];
  onAddToShopping: (recipe: MatchedRecipe) => void;
  servings: number;
  favoriteIds?: Set<string>;
  menuRecipeIds?: Set<string>;
  onToggleFavorite?: (id: string) => void;
  onView?: (id: string) => void;
}

export const RecipeListOptimized = memo(function RecipeList({
  recipes,
  onAddToShopping,
  servings,
  favoriteIds = new Set(),
  menuRecipeIds = new Set(),
  onToggleFavorite,
  onView,
}: RecipeListProps) {
  // 使用 useMemo 缓存计算结果
  const canCookCount = useMemo(() => {
    return recipes.filter(r => r.canCook).length;
  }, [recipes]);

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无匹配菜谱</h3>
        <p className="text-gray-500">添加一些食材试试吧！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCardOptimized
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoriteIds.has(recipe.id)}
          onToggleFavorite={onToggleFavorite || (() => {})}
          onAddToShopping={onAddToShopping}
          onView={onView}
          inMenu={menuRecipeIds.has(recipe.id)}
          servings={servings}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较：只比较数组长度和 servings
  return (
    prevProps.recipes.length === nextProps.recipes.length &&
    prevProps.servings === nextProps.servings
  );
});

/**
 * 性能优化说明：
 * 1. 使用 React.memo 包裹组件
 * 2. 自定义比较函数：只比较 recipes 数量（非深度比较）
 * 3. 使用 useMemo 缓存计算结果
 * 4. 避免在渲染中创建新函数
 */
