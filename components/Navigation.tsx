/**
 * Navigation 组件
 * 应用导航栏
 */

'use client';

import { useState, useCallback, memo } from 'react';
import { ChefHat, Heart, Share2, Package, BookOpen, Menu as MenuIcon, X, Users, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  servings: number;
  copied: boolean;
  onServingsChange: (servings: number) => void;
  onShare: () => void;
  onOpenPantry: () => void;
  onOpenFavorites: () => void;
  onOpenMenu: () => void;
  onOpenShoppingList: () => void;
}

export const Navigation = memo(function Navigation({
  servings,
  copied,
  onServingsChange,
  onShare,
  onOpenPantry,
  onOpenFavorites,
  onOpenMenu,
  onOpenShoppingList,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleServingsChange = useCallback((num: number) => {
    onServingsChange(num);
    setMobileMenuOpen(false);
  }, [onServingsChange]);

  const handleMobileNavClick = useCallback((action: () => void) => {
    action();
    setMobileMenuOpen(false);
  }, []);

  const handleShareClick = useCallback(() => {
    onShare();
    setMobileMenuOpen(false);
  }, [onShare]);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <ServingsSelector servings={servings} onChange={handleServingsChange} />
            <DesktopNavButton onClick={onOpenPantry} icon={<Package className="w-5 h-5" />}>
              库存
            </DesktopNavButton>
            <DesktopNavButton onClick={onOpenFavorites} icon={<Heart className="w-5 h-5" />}>
              收藏
            </DesktopNavButton>
            <DesktopNavButton onClick={onOpenMenu} icon={<BookOpen className="w-5 h-5" />}>
              菜单
            </DesktopNavButton>
            <DesktopNavButton onClick={onOpenShoppingList} icon={<span className="text-lg">🛒</span>}>
              清单
            </DesktopNavButton>
            <DesktopNavButton
              onClick={handleShareClick}
              className="bg-orange-500 text-white hover:bg-orange-600"
              icon={<Share2 className="w-5 h-5" />}
            >
              {copied ? '已复制链接' : '分享'}
            </DesktopNavButton>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl min-w-[44px] min-h-[44px]"
            aria-label="打开菜单"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <MobileNavMenu
              onOpenPantry={() => handleMobileNavClick(onOpenPantry)}
              onOpenFavorites={() => handleMobileNavClick(onOpenFavorites)}
              onOpenMenu={() => handleMobileNavClick(onOpenMenu)}
              onOpenShoppingList={() => handleMobileNavClick(onOpenShoppingList)}
              onShare={handleShareClick}
              copied={copied}
            />
          </div>
        )}
      </div>
    </nav>
  );
});

// 人数选择器
const ServingsSelector = memo(function ServingsSelector({
  servings,
  onChange,
}: {
  servings: number;
  onChange: (num: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-orange-50 rounded-xl">
      <Users className="w-4 h-4 text-orange-600" />
      <span className="text-sm text-gray-700 mr-1">{servings}人</span>
      {[1, 2, 3, 4, 5, 6].map(num => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={cn(
            "w-6 h-6 rounded-lg text-xs font-medium transition-all accessibility-focus",
            servings === num
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          )}
          aria-label={`${num}人`}
        >
          {num}
        </button>
      ))}
    </div>
  );
});

// 桌面端导航按钮
function DesktopNavButton({
  children,
  onClick,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors min-h-[44px]",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}

// 移动端菜单
function MobileNavMenu({
  onOpenPantry,
  onOpenFavorites,
  onOpenMenu,
  onOpenShoppingList,
  onShare,
  copied,
}: {
  onOpenPantry: () => void;
  onOpenFavorites: () => void;
  onOpenMenu: () => void;
  onOpenShoppingList: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  return (
    <div className="px-4 py-3 space-y-2">
      <MobileNavButton onClick={onOpenPantry} icon={<Package className="w-5 h-5" />}>
        我的库存
      </MobileNavButton>
      <MobileNavButton onClick={onOpenFavorites} icon={<Heart className="w-5 h-5" />}>
        我的收藏
      </MobileNavButton>
      <MobileNavButton onClick={onOpenMenu} icon={<BookOpen className="w-5 h-5" />}>
        我的菜单
      </MobileNavButton>
      <MobileNavButton onClick={onOpenShoppingList} icon={<span className="text-lg">🛒</span>}>
        购物清单
      </MobileNavButton>
      <MobileNavButton
        onClick={onShare}
        className="bg-orange-50 text-orange-700"
        icon={<Share2 className="w-5 h-5" />}
      >
        {copied ? '已分享' : '分享给好友'}
      </MobileNavButton>
    </div>
  );
}

function MobileNavButton({
  children,
  onClick,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 rounded-xl touch-manipulation transition-colors min-h-[44px]",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}
