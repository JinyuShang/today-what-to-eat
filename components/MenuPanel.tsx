'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, X, Trash2, ShoppingCart, Calendar, CheckCircle, Users } from 'lucide-react';
import { MatchedRecipe } from '@/types';
import { formatTime, cn } from '@/lib/utils';
import { getIngredientCategory } from '@/lib/utils';
import { matchRecipes } from '@/lib/recipe-db';
import { calculateIngredientAmount, getShoppingTips } from '@/lib/ingredient-portions';

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userIngredients?: string[]; // 新增：用户输入的食材
  servings: number; // 全局人数设置
}

interface MenuItem {
  recipe: MatchedRecipe;
  addedAt: number;
  originalMissingIngredients: string[]; // 记录添加时的缺少食材
}

export function MenuPanel({ isOpen, onClose, userIngredients = [], servings }: MenuPanelProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
  const [purchasedIngredients, setPurchasedIngredients] = useState<Set<string>>(new Set()); // 已购买的食材

  // 从 localStorage 加载菜单
  useEffect(() => {
    const saved = localStorage.getItem('menu-items');
    if (saved) {
      setMenuItems(JSON.parse(saved));
    }
  }, []);

  // 加载库存食材
  useEffect(() => {
    const loadPantry = () => {
      const pantry = JSON.parse(localStorage.getItem('pantry-items') || '[]');
      setPantryIngredients(pantry);
    };

    loadPantry();

    // 监听库存更新事件
    window.addEventListener('pantry-updated', loadPantry);
    return () => {
      window.removeEventListener('pantry-updated', loadPantry);
    };
  }, []);

  // 添加菜谱到菜单（暴露给外部调用）
  useEffect(() => {
    (window as any).addRecipeToMenu = (recipe: MatchedRecipe) => {
      setMenuItems(prev => {
        // 检查是否已存在
        if (prev.some(item => item.recipe.id === recipe.id)) {
          return prev;
        }
        const newItem: MenuItem = {
          recipe,
          addedAt: Date.now(),
          originalMissingIngredients: recipe.missingIngredients // 记录添加时的缺少食材
        };
        const updated = [newItem, ...prev];
        localStorage.setItem('menu-items', JSON.stringify(updated));
        // 触发事件通知其他组件
        window.dispatchEvent(new Event('menu-changed'));
        return updated;
      });
    };
  }, []);

  // 计算每个菜谱的实际匹配情况
  const menuItemsWithMatch = useMemo(() => {
    return menuItems.map(item => {
      // 可用的食材 = 用户输入 + 库存 + 已购买的
      const available = [
        ...userIngredients,
        ...pantryIngredients,
        ...Array.from(purchasedIngredients)
      ];

      // 重新计算每个食材是否匹配
      const matchedIngredients: string[] = [];
      const missingIngredients: string[] = [];

      item.recipe.ingredients.forEach(ing => {
        const hasIngredient = available.some(a => {
          const aLower = a.toLowerCase();
          const ingLower = ing.toLowerCase();
          return aLower === ingLower || aLower.includes(ingLower) || ingLower.includes(aLower);
        });

        if (hasIngredient) {
          matchedIngredients.push(ing);
        } else {
          missingIngredients.push(ing);
        }
      });

      // 重新计算匹配度
      const totalIngredients = item.recipe.ingredients.length;
      const matchScore = matchedIngredients.length / totalIngredients;
      // 只有100%匹配才能做（所有食材都齐全）
      const canCook = missingIngredients.length === 0;

      return {
        ...item,
        canCook,
        matchScore,
        matchedIngredients,
        missingIngredients
      };
    });
  }, [menuItems, pantryIngredients, purchasedIngredients, userIngredients]);

  // 统计缺少的食材（基于最新库存）
  const allMissingIngredients = useMemo(() => {
    const ingredientMap = new Map<string, { category: string; count: number }>();

    menuItemsWithMatch.forEach(item => {
      item.missingIngredients.forEach(ing => {
        if (!ingredientMap.has(ing)) {
          ingredientMap.set(ing, {
            category: getIngredientCategory(ing),
            count: 0
          });
        }
        ingredientMap.get(ing)!.count++;
      });
    });

    return Array.from(ingredientMap.entries()).map(([name, info]) => ({
      name,
      category: info.category,
      count: info.count
    }));
  }, [menuItemsWithMatch]);

  const removeRecipe = (recipeId: string) => {
    setMenuItems(prev => {
      const updated = prev.filter(item => item.recipe.id !== recipeId);
      localStorage.setItem('menu-items', JSON.stringify(updated));
      window.dispatchEvent(new Event('menu-changed'));
      return updated;
    });
  };

  const clearAllRecipes = () => {
    if (confirm('确定要清空所有菜单吗？')) {
      setMenuItems([]);
      localStorage.removeItem('menu-items');
      window.dispatchEvent(new Event('menu-changed'));
    }
  };

  // 生成购物清单
  const handleGenerateShopping = () => {
    const ingredientsWithAmounts = allMissingIngredients.map(item =>
      calculateIngredientAmount(item.name, servings)
    );

    if (ingredientsWithAmounts.length > 0) {
      // 先清空旧购物清单和 localStorage
      localStorage.removeItem('shopping-list');
      // 触发重置事件（清空组件状态）
      window.dispatchEvent(new CustomEvent('reset-shopping-list'));
      // 稍微延迟确保重置完成后再添加食材
      setTimeout(() => {
        (window as any).addShoppingItems?.(ingredientsWithAmounts);
        // 然后打开购物清单面板
        window.dispatchEvent(new CustomEvent('open-shopping-list'));
      }, 0);
      onClose();
    } else {
      alert('所有食材都齐全了，可以直接做菜！');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">我的菜单</h2>
                <p className="text-sm text-gray-500">{menuItems.length} 道菜</p>
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

        {/* 统计信息 */}
        {menuItems.length > 0 && (
          <div className="px-6 py-3 bg-purple-50 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-800">
                {allMissingIngredients.length > 0 && (
                  <span>📅 共需 <strong>{allMissingIngredients.length}</strong> 种食材</span>
                )}
                {allMissingIngredients.length === 0 && (
                  <span>✅ 食材都齐全，可以做菜了！</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-purple-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{servings}人份</span>
              </div>
            </div>
            {menuItemsWithMatch.filter(i => i.canCook).length > 0 && (
              <div className="mt-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {menuItemsWithMatch.filter(i => i.canCook).length} 道菜可以做了
              </div>
            )}
            {allMissingIngredients.length > 0 && (
              <div className="mt-2 space-y-1">
                {getShoppingTips(allMissingIngredients.map(i => i.name), servings).map((tip, idx) => (
                  <div key={idx} className="text-xs text-purple-700">{tip}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 菜单列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {menuItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>菜单是空的</p>
              <p className="text-sm mt-2">从菜谱卡片点击「加菜单」添加</p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItemsWithMatch.map((item) => (
                <div
                  key={item.recipe.id}
                  className={cn(
                    "group relative p-4 rounded-xl transition-all",
                    item.canCook
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-white border-2 border-purple-100"
                  )}
                >
                  {/* 内容 */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={cn(
                          "font-bold text-gray-900",
                          item.canCook && "text-green-700"
                        )}>
                          {item.recipe.name}
                        </h3>
                        {item.canCook && (
                          <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs font-medium">
                            可以做了！
                          </span>
                        )}
                      </div>

                      {/* 标签 */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatTime(item.recipe.time)}
                        </div>
                        <span className={cn(
                          "font-medium",
                          item.canCook ? "text-green-600" : "text-purple-600"
                        )}>
                          {Math.round(item.matchScore * 100)}% 匹配
                        </span>
                      </div>

                      {/* 缺少食材 */}
                      {item.missingIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.missingIngredients.map(ing => (
                            <span
                              key={ing}
                              className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs"
                            >
                              + {ing}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={() => removeRecipe(item.recipe.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="从菜单移除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        {menuItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={clearAllRecipes}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              清空所有
            </button>
            <button
              onClick={handleGenerateShopping}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium text-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              生成清单
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
