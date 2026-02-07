'use client';

import { useState, useEffect } from 'react';
import { ChefHat, Heart, Share2, Sparkles, Menu as MenuIcon, X, Package, BookOpen } from 'lucide-react';
import { IngredientInput } from '@/components/IngredientInput';
import { RecipeList } from '@/components/RecipeList';
import { ShoppingList } from '@/components/ShoppingList';
import { FavoritesPanel } from '@/components/FavoritesPanel';
import { PantryPanel } from '@/components/PantryPanel';
import { MenuPanel } from '@/components/MenuPanel';
import { matchRecipes, getFeaturedRecipes } from '@/lib/recipe-db';
import { parseShareUrl, generateShareUrl, copyToClipboard } from '@/lib/utils';
import { MatchedRecipe } from '@/types';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 解析分享链接 + 加载库存食材
  useEffect(() => {
    const { ingredients: sharedIngredients } = parseShareUrl();
    let baseIngredients: string[] = [];

    // 加载库存食材
    const pantryItems = localStorage.getItem('pantry-items');
    if (pantryItems) {
      baseIngredients = JSON.parse(pantryItems);
    }

    if (sharedIngredients.length > 0) {
      // 有分享链接，合并分享食材和库存食材
      const allIngredients = Array.from(new Set([...baseIngredients, ...sharedIngredients]));
      setIngredients(allIngredients);
      // 保存到库存
      localStorage.setItem('pantry-items', JSON.stringify(allIngredients));
      const matched = matchRecipes(allIngredients);
      setMatchedRecipes(matched);
    } else if (baseIngredients.length > 0) {
      // 只有库存食材
      setIngredients(baseIngredients);
      const matched = matchRecipes(baseIngredients);
      setMatchedRecipes(matched);
    } else {
      // 默认显示推荐菜谱
      const featured = getFeaturedRecipes(6);
      setMatchedRecipes(featured.map(r => ({ ...r, matchScore: 1, matchedIngredients: r.ingredients, missingIngredients: [], canCook: true })));
    }
  }, []);

  // 监听打开购物清单事件
  useEffect(() => {
    const handleOpenShoppingList = () => {
      setShowShoppingList(true);
    };

    window.addEventListener('open-shopping-list', handleOpenShoppingList);
    return () => {
      window.removeEventListener('open-shopping-list', handleOpenShoppingList);
    };
  }, []);

  // 监听库存更新事件，重新计算菜谱匹配
  useEffect(() => {
    const handlePantryUpdate = () => {
      const pantryItems = JSON.parse(localStorage.getItem('pantry-items') || '[]');
      // 同步库存食材到输入框
      setIngredients(pantryItems);
      const matched = matchRecipes(pantryItems);
      setMatchedRecipes(matched);
    };

    const handleRecipesNeedUpdate = () => {
      handlePantryUpdate();
    };

    window.addEventListener('pantry-updated', handlePantryUpdate);
    window.addEventListener('recipes-need-update', handleRecipesNeedUpdate);
    return () => {
      window.removeEventListener('pantry-updated', handlePantryUpdate);
      window.removeEventListener('recipes-need-update', handleRecipesNeedUpdate);
    };
  }, []);

  // 添加食材（同步到库存）
  const handleAddIngredient = (ingredient: string) => {
    const newIngredients = [...ingredients, ingredient];
    setIngredients(newIngredients);
    // 同步到库存
    localStorage.setItem('pantry-items', JSON.stringify(newIngredients));
    const matched = matchRecipes(newIngredients);
    setMatchedRecipes(matched);
  };

  // 移除食材（同步到库存）
  const handleRemoveIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(i => i !== ingredient);
    setIngredients(newIngredients);
    // 同步到库存
    localStorage.setItem('pantry-items', JSON.stringify(newIngredients));
    const matched = matchRecipes(newIngredients);
    setMatchedRecipes(matched);
  };

  // 添加到菜单
  const handleAddToShopping = (recipe: MatchedRecipe) => {
    (window as any).addRecipeToMenu?.(recipe);
  };

  // 分享功能
  const handleShare = async () => {
    const url = generateShareUrl(ingredients, matchedRecipes.map(r => r.id));
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canCookCount = matchedRecipes.filter(r => r.canCook).length;

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-xl">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">今天吃什么</h1>
                <p className="text-xs text-gray-500 hidden sm:block">剩余食材智能推荐</p>
              </div>
            </div>

            {/* 桌面端菜单 */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setShowPantry(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <Package className="w-5 h-5" />
                库存
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <Heart className="w-5 h-5" />
                收藏
              </button>
              <button
                onClick={() => setShowMenu(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                菜单
              </button>
              <button
                onClick={() => setShowShoppingList(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors"
              >
                🛒 清单
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                {copied ? '已复制链接' : '分享'}
              </button>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => { setShowPantry(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-xl"
              >
                <Package className="w-5 h-5" />
                我的库存
              </button>
              <button
                onClick={() => { setShowFavorites(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-xl"
              >
                <Heart className="w-5 h-5" />
                我的收藏
              </button>
              <button
                onClick={() => { setShowMenu(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-xl"
              >
                <BookOpen className="w-5 h-5" />
                我的菜单
              </button>
              <button
                onClick={() => { setShowShoppingList(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-xl"
              >
                🛒 购物清单
              </button>
              <button
                onClick={() => { handleShare(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left bg-orange-50 text-orange-700 rounded-xl"
              >
                <Share2 className="w-5 h-5" />
                {copied ? '已复制链接' : '分享给好友'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero 区域 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            打开冰箱，<span className="text-orange-500">不知道做什么？</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            输入你现有的食材，AI 智能推荐可用菜谱 🍳
          </p>
          {ingredients.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              找到 {matchedRecipes.length} 道菜谱 · {canCookCount} 道现在就能做
            </div>
          )}
        </div>

        {/* 食材输入区 */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🥕 输入你冰箱里的食材
            </h3>
            <IngredientInput
              ingredients={ingredients}
              onAdd={handleAddIngredient}
              onRemove={handleRemoveIngredient}
            />
          </div>
        </div>

        {/* 菜谱列表 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {ingredients.length > 0 ? '推荐菜谱' : '热门菜谱'}
            </h3>
            {matchedRecipes.length > 0 && (
              <span className="text-sm text-gray-500">
                共 {matchedRecipes.length} 道菜
              </span>
            )}
          </div>

          <RecipeList
            recipes={matchedRecipes}
            onAddToShopping={handleAddToShopping}
          />
        </div>
      </main>

      {/* 底部 */}
      <footer className="mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>🍳 今天吃什么 - 剩余食材菜谱生成器</p>
          <p className="mt-2">为黑客松而作 · 1小时快速开发</p>
        </div>
      </footer>

      {/* 弹窗 */}
      <ShoppingList
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
      />

      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onRemove={(recipeId) => {
          // 触发页面刷新以更新收藏状态
          window.dispatchEvent(new CustomEvent('favorite-changed', { detail: { recipeId } }));
        }}
      />

      <PantryPanel
        isOpen={showPantry}
        onClose={() => setShowPantry(false)}
      />

      <MenuPanel
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        userIngredients={ingredients}
      />
    </div>
  );
}
