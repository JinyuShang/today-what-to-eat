'use client';

import { useState, useEffect } from 'react';
import { Package, Check, X, Save, AlertCircle } from 'lucide-react';
import { INGREDIENT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';
import { NUMERIC, ERROR_MESSAGES } from '@/lib/constants';

interface PantryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// 预设常用食材
const DEFAULT_PANTRY_ITEMS = {
  vegetable: ['番茄', '土豆', '洋葱', '胡萝卜', '白菜', '青椒', '蒜', '姜', '葱'],
  meat: ['鸡蛋', '猪肉', '鸡肉'],
  seasoning: ['盐', '糖', '酱油', '醋', '料酒', '蚝油', '豆瓣酱', '胡椒粉', '辣椒'],
  staple: ['大米', '面条']
};

const CATEGORY_NAMES = {
  vegetable: '🥬 蔬菜',
  meat: '🥩 肉蛋奶',
  seasoning: '🧂 调料',
  staple: '🍚 主食'
};

export function PantryPanel({ isOpen, onClose }: PantryPanelProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [customItem, setCustomItem] = useState('');
  const [customItemError, setCustomItemError] = useState<string | null>(null);

  // 添加自定义食材（带验证）
  const addCustomItem = (item: string) => {
    const trimmed = item.trim();

    // 验证：空字符串
    if (!trimmed) {
      setCustomItemError('请输入食材名称');
      return false;
    }

    // 验证：长度限制
    if (trimmed.length > NUMERIC.MAX_INGREDIENT_LENGTH) {
      setCustomItemError(ERROR_MESSAGES.INGREDIENT_TOO_LONG);
      return false;
    }

    // 验证：重复检查
    if (selectedItems.has(trimmed)) {
      setCustomItemError('该食材已添加');
      return false;
    }

    // 清除错误并添加
    setCustomItemError(null);
    setSelectedItems(prev => new Set(prev).add(trimmed));
    setCustomItem('');
    return true;
  };

  // 从 localStorage 加载库存（每次打开时重新加载）
  useEffect(() => {
    if (!isOpen) return;

    const saved = localStorage.getItem('pantry-items');
    if (saved) {
      setSelectedItems(new Set(JSON.parse(saved)));
    } else {
      // 默认选中一些常用调料
      const defaults = ['盐', '糖', '酱油', '醋', '蒜', '姜', '葱', '鸡蛋'];
      setSelectedItems(new Set(defaults));
    }
  }, [isOpen]);

  // 保存库存
  const handleSave = () => {
    localStorage.setItem('pantry-items', JSON.stringify(Array.from(selectedItems)));
    // 触发更新事件，通知首页和其他组件
    window.dispatchEvent(new CustomEvent('pantry-updated'));
    onClose();
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const selectCategory = (category: keyof typeof DEFAULT_PANTRY_ITEMS) => {
    const items = DEFAULT_PANTRY_ITEMS[category];
    setSelectedItems(prev => {
      const next = new Set(prev);
      items.forEach(item => next.add(item));
      return next;
    });
  };

  const deselectCategory = (category: keyof typeof DEFAULT_PANTRY_ITEMS) => {
    const items = DEFAULT_PANTRY_ITEMS[category];
    setSelectedItems(prev => {
      const next = new Set(prev);
      items.forEach(item => next.delete(item));
      return next;
    });
  };

  if (!isOpen) return null;

  const selectedCount = selectedItems.size;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">我的库存食材</h2>
                <p className="text-sm text-gray-500">已选择 {selectedCount} 种食材</p>
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

        {/* 说明 */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800">
            💡 勾选你常备的食材，这些食材会自动添加到每次搜索中，不用重复输入！
          </p>
        </div>

        {/* 食材列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(DEFAULT_PANTRY_ITEMS).map(([category, items]) => (
            <div key={category} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectCategory(category as keyof typeof DEFAULT_PANTRY_ITEMS)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    全选
                  </button>
                  <button
                    onClick={() => deselectCategory(category as keyof typeof DEFAULT_PANTRY_ITEMS)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {items.map(item => {
                  const isSelected = selectedItems.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleItem(item)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all text-center",
                        isSelected
                          ? "bg-blue-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 mx-auto mb-1" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 其他自定义食材 */}
          {(() => {
            const allDefaultItems = Object.values(DEFAULT_PANTRY_ITEMS).flat();
            const customItems = Array.from(selectedItems).filter(item => !allDefaultItems.includes(item));

            return (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    📦 其他食材
                  </h3>
                  {customItems.length > 0 && (
                    <button
                      onClick={() => {
                        customItems.forEach(item => selectedItems.delete(item));
                        setSelectedItems(new Set(selectedItems));
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      清空全部
                    </button>
                  )}
                </div>

                {/* 添加自定义食材输入框 */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customItem}
                    onChange={(e) => {
                      setCustomItem(e.target.value);
                      setCustomItemError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addCustomItem(customItem);
                      }
                    }}
                    placeholder="输入自定义食材，如：牛肉、豆腐..."
                    maxLength={NUMERIC.MAX_INGREDIENT_LENGTH}
                    className={cn(
                      "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent",
                      customItemError
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    )}
                  />
                  <button
                    onClick={() => addCustomItem(customItem)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    添加
                  </button>
                </div>

                {/* 自定义食材错误提示 */}
                {customItemError && (
                  <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{customItemError}</span>
                  </div>
                )}

                {/* 自定义食材列表 */}
                {customItems.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {customItems.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all text-center bg-blue-500 text-white shadow-sm"
                      >
                        <Check className="w-4 h-4 mx-auto mb-1" />
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* 底部操作 */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            保存并应用 ({selectedCount} 种)
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
