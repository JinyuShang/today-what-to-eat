'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { INGREDIENT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';
import { NUMERIC, ERROR_MESSAGES } from '@/lib/constants';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
}

export function IngredientInput({ ingredients, onAdd, onRemove }: IngredientInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (ingredient: string) => {
    const trimmed = ingredient.trim();

    // 验证：空字符串
    if (!trimmed) {
      setError('请输入食材名称');
      return;
    }

    // 验证：长度限制
    if (trimmed.length > NUMERIC.MAX_INGREDIENT_LENGTH) {
      setError(ERROR_MESSAGES.INGREDIENT_TOO_LONG);
      return;
    }

    // 验证：重复检查
    if (ingredients.includes(trimmed)) {
      setError('该食材已添加');
      return;
    }

    // 清除错误并添加
    setError(null);
    onAdd(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(input);
    }
  };

  const quickIngredients = [
    '番茄', '鸡蛋', '土豆', '豆腐', '猪肉', '牛肉',
    '白菜', '胡萝卜', '青椒', '洋葱', '鸡肉', '鱼',
    '蒜', '姜', '葱', '盐', '糖', '酱油', '料酒', '醋'
  ];

  return (
    <div className="space-y-4">
      {/* 输入框 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null); // 清除错误
            }}
            onKeyDown={handleKeyDown}
            placeholder="输入食材，如：番茄、鸡蛋..."
            maxLength={NUMERIC.MAX_INGREDIENT_LENGTH}
            className={cn(
              "w-full px-4 py-3 pr-14 md:pr-12 border-2 rounded-xl focus:outline-none transition-colors touch-manipulation",
              error
                ? "border-red-300 focus:border-red-400"
                : "border-orange-200 focus:border-orange-400"
            )}
          />
          <button
            onClick={() => handleAdd(input)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 md:p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 已选食材 */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {ingredients.map((ing) => (
            <div
              key={ing}
              className="flex items-center gap-1 px-3 py-2 md:py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
            >
              <span>{ing}</span>
              <button
                onClick={() => onRemove(ing)}
                className="p-1 md:p-0.5 hover:bg-orange-200 rounded-full transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation"
              >
                <X className="w-3.5 h-3.5 md:w-3 md:h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 快捷选择 */}
      <div>
        <p className="text-sm text-gray-600 mb-2">快捷添加常见食材：</p>
        <div className="flex flex-wrap gap-2">
          {quickIngredients
            .filter(ing => !ingredients.includes(ing))
            .slice(0, 15)
            .map((ing) => (
              <button
                key={ing}
                onClick={() => handleAdd(ing)}
                className="px-4 py-2.5 md:px-3 md:py-1.5 bg-white border-2 border-orange-200 text-orange-700 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-300 transition-all touch-manipulation min-h-[44px]"
              >
                {ing}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
