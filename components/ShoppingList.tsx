'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Check, X, Copy, Trash2 } from 'lucide-react';
import { ShoppingItem } from '@/types';
import { getIngredientCategory } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingList({ isOpen, onClose }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [copied, setCopied] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem('shopping-list');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 监听重置购物清单事件
  useEffect(() => {
    const handleReset = () => {
      setItems([]);
    };
    window.addEventListener('reset-shopping-list', handleReset);
    return () => {
      window.removeEventListener('reset-shopping-list', handleReset);
    };
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('shopping-list', JSON.stringify(items));
    }
  }, [items]);

  const addItems = (ingredients: string[]) => {
    setItems(prev => {
      const newItems = ingredients
        .filter(ing => !prev.some(item => item.name === ing))
        .map(name => ({
          name,
          category: getIngredientCategory(name) as any,
          checked: false
        }));
      return [...prev, ...newItems];
    });
  };

  // 暴露给外部调用（使用 useRef 保持引用稳定）
  useEffect(() => {
    (window as any).addShoppingItems = addItems;
  }, []);

  const toggleCheck = (index: number) => {
    setItems(prev => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );

      // 如果是勾选操作（从未勾选变为已勾选），添加到库存 + 记录购买
      const toggledItem = updated[index];
      if (toggledItem.checked) {
        // 添加到库存食材
        const pantry = JSON.parse(localStorage.getItem('pantry-items') || '[]');
        if (!pantry.includes(toggledItem.name)) {
          pantry.push(toggledItem.name);
          localStorage.setItem('pantry-items', JSON.stringify(pantry));

          // 记录已购买的食材
          const purchased = JSON.parse(localStorage.getItem('purchased-ingredients') || '[]');
          if (!purchased.includes(toggledItem.name)) {
            purchased.push(toggledItem.name);
            localStorage.setItem('purchased-ingredients', JSON.stringify(purchased));
            // 触发事件通知菜单更新
            window.dispatchEvent(new CustomEvent('ingredients-purchased'));
          }
        }

        // 触发事件通知其他组件更新
        window.dispatchEvent(new CustomEvent('pantry-updated'));
      }

      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const checkAllItems = () => {
    setItems(prev => {
      // 勾选所有未勾选的食材
      const updated = prev.map(item => ({ ...item, checked: true }));

      // 将所有食材添加到库存
      const pantry = JSON.parse(localStorage.getItem('pantry-items') || '[]');
      const purchased = JSON.parse(localStorage.getItem('purchased-ingredients') || '[]');

      prev.forEach(item => {
        if (!pantry.includes(item.name)) {
          pantry.push(item.name);
        }
        if (!purchased.includes(item.name)) {
          purchased.push(item.name);
        }
      });

      localStorage.setItem('pantry-items', JSON.stringify(pantry));
      localStorage.setItem('purchased-ingredients', JSON.stringify(purchased));

      // 触发更新事件
      window.dispatchEvent(new CustomEvent('pantry-updated'));
      window.dispatchEvent(new CustomEvent('ingredients-purchased'));

      return updated;
    });
  };

  const copyToClipboard = async () => {
    const text = items
      .map(item => `${item.checked ? '✓' : '○'} ${item.name}`)
      .join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // 按类别分组
  const grouped = items.reduce((acc, item, index) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({ ...item, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<ShoppingItem & { originalIndex: number }>>);

  const categoryNames = {
    vegetable: '🥬 蔬菜',
    meat: '🥩 肉类',
    seasoning: '🧂 调料',
    staple: '🍚 主食',
    other: '📦 其他'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">购物清单</h2>
                <p className="text-sm text-gray-500">{items.length} 项 · {items.filter(i => i.checked).length} 已购买</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>清单是空的</p>
              <p className="text-sm mt-2">从菜谱中点击「加清单」添加食材</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-gray-700 sticky top-0 bg-white py-2">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
                {categoryItems.map(item => (
                  <div
                    key={item.originalIndex}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      item.checked ? "bg-gray-50 opacity-60" : "bg-white border border-gray-100 hover:border-orange-200"
                    )}
                  >
                    <button
                      onClick={() => toggleCheck(item.originalIndex)}
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        item.checked
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-orange-400"
                      )}
                    >
                      {item.checked && <Check className="w-4 h-4" />}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm",
                      item.checked && "line-through text-gray-400"
                    )}>
                      {item.name}
                      {item.checked && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          ✓ 已入库存
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeItem(item.originalIndex)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* 底部操作 */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? '已复制！' : '复制清单'}
            </button>
            <button
              onClick={checkAllItems}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <Check className="w-5 h-5" />
              采购已完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
