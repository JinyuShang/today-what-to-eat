'use client';

import { useState, useEffect } from 'react';
import { MatchedRecipe } from '@/types';
import { RecipeCard } from './RecipeCard';
import { isFavorite, addFavorite, removeFavorite, addHistory } from '@/lib/storage';

interface RecipeListProps {
  recipes: MatchedRecipe[];
  onAddToShopping: (recipe: MatchedRecipe) => void;
  servings: number; // 全局人数设置
}

export function RecipeList({ recipes, onAddToShopping, servings }: RecipeListProps) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [menuRecipeIds, setMenuRecipeIds] = useState<Set<string>>(new Set());

  // 加载收藏状态
  useEffect(() => {
    const favorites = recipes.map(r => r.id).filter(id => isFavorite(id));
    setFavoriteIds(new Set(favorites));
  }, [recipes]);

  // 加载菜单状态
  useEffect(() => {
    const saved = localStorage.getItem('menu-items');
    if (saved) {
      const menuItems = JSON.parse(saved);
      const ids = new Set<string>(menuItems.map((item: any) => item.recipe.id));
      setMenuRecipeIds(ids);
    }
  }, []);

  // 监听收藏变化事件（从收藏面板删除时触发）
  useEffect(() => {
    const handleFavoriteChange = (e: CustomEvent) => {
      const { recipeId } = e.detail;
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(recipeId);
        return next;
      });
    };

    window.addEventListener('favorite-changed', handleFavoriteChange as EventListener);
    return () => {
      window.removeEventListener('favorite-changed', handleFavoriteChange as EventListener);
    };
  }, []);

  // 监听菜单变化事件
  useEffect(() => {
    const handleMenuChange = () => {
      const saved = localStorage.getItem('menu-items');
      if (saved) {
        const menuItems = JSON.parse(saved);
        const ids = new Set<string>(menuItems.map((item: any) => item.recipe.id));
        setMenuRecipeIds(ids);
      } else {
        setMenuRecipeIds(new Set());
      }
    };

    window.addEventListener('menu-changed', handleMenuChange as EventListener);
    return () => {
      window.removeEventListener('menu-changed', handleMenuChange as EventListener);
    };
  }, []);

  // 监听库存更新事件
  useEffect(() => {
    const handlePantryUpdate = () => {
      // 触发父组件重新匹配菜谱
      window.dispatchEvent(new Event('recipes-need-update'));
    };

    window.addEventListener('pantry-updated', handlePantryUpdate);
    return () => {
      window.removeEventListener('pantry-updated', handlePantryUpdate);
    };
  }, []);

  const handleToggleFavorite = (id: string) => {
    if (favoriteIds.has(id)) {
      removeFavorite(id);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      addFavorite(id);
      setFavoriteIds(prev => new Set(prev).add(id));
    }
  };

  const handleView = (id: string) => {
    addHistory(id);
  };

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
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoriteIds.has(recipe.id)}
          onToggleFavorite={handleToggleFavorite}
          onAddToShopping={onAddToShopping}
          onView={handleView}
          inMenu={menuRecipeIds.has(recipe.id)}
          servings={servings}
        />
      ))}
    </div>
  );
}
