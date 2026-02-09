'use client';

import { useState, useEffect } from 'react';
import { getUserData, removeFavorite } from '@/lib/storage';
import { getRecipeById, matchRecipes } from '@/lib/recipe-db';
import { Clock, Heart, X, Trash2, BookOpen, Check } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { safeGetItem } from '@/lib/storage-helpers';
import { STORAGE_KEYS, EVENT_NAMES } from '@/lib/constants';
import { MenuItem } from '@/types';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void; // 添加删除回调
}

export function FavoritesPanel({ isOpen, onClose, onSelect, onRemove }: FavoritesPanelProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [menuRecipeIds, setMenuRecipeIds] = useState<Set<string>>(new Set());
  const [addedRecipeId, setAddedRecipeId] = useState<string | null>(null);

  // 每次打开时重新加载收藏列表和菜单状态
  useEffect(() => {
    if (isOpen) {
      const data = getUserData();
      setFavoriteIds(data.favorites);

      // 加载菜单中的菜谱
      const menuItems = safeGetItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
      const ids = new Set<string>(menuItems.map(item => item.recipe.id));
      setMenuRecipeIds(ids);
    }
  }, [isOpen]);

  // 监听菜单变化
  useEffect(() => {
    const handleMenuChange = () => {
      const menuItems = safeGetItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
      const ids = new Set<string>(menuItems.map(item => item.recipe.id));
      setMenuRecipeIds(ids);
    };

    window.addEventListener(EVENT_NAMES.MENU_CHANGED, handleMenuChange);
    return () => {
      window.removeEventListener(EVENT_NAMES.MENU_CHANGED, handleMenuChange);
    };
  }, []);

  const favoriteRecipes = favoriteIds
    .map(id => getRecipeById(id))
    .filter(Boolean);

  // 添加到菜单
  const handleAddToMenu = (recipe: any, e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).addRecipeToMenu?.(recipe);
    setAddedRecipeId(recipe.id);
    setTimeout(() => setAddedRecipeId(null), 2000);

    // 更新菜单状态
    setMenuRecipeIds(prev => new Set(prev).add(recipe.id));
  };

  const handleRemove = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation(); // 阻止触发卡片点击事件
    removeFavorite(recipeId);
    setFavoriteIds(prev => prev.filter(id => id !== recipeId));
    onRemove?.(recipeId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">我的收藏</h2>
                <p className="text-sm text-gray-500">{favoriteRecipes.length} 道菜</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {favoriteRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>还没有收藏</p>
              <p className="text-sm mt-2">点击菜谱卡片上的爱心收藏</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteRecipes.map(recipe => recipe && (
                <div
                  key={recipe.id}
                  className="group relative p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => handleRemove(e, recipe.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    title="取消收藏"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="pr-8">
                    <h3 className="font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(recipe.time)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-white px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.ingredients.slice(0, 4).map(ing => (
                        <span key={ing} className="text-xs text-gray-500">
                          {ing}
                        </span>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{recipe.ingredients.length - 4}
                        </span>
                      )}
                    </div>

                    {/* 加菜单按钮 */}
                    <button
                      onClick={(e) => handleAddToMenu(recipe, e)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        addedRecipeId === recipe.id || menuRecipeIds.has(recipe.id)
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {addedRecipeId === recipe.id || menuRecipeIds.has(recipe.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          已加入菜单
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          加菜单
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
