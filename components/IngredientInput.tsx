'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { INGREDIENT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
}

export function IngredientInput({ ingredients, onAdd, onRemove }: IngredientInputProps) {
  const [input, setInput] = useState('');

  const handleAdd = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入食材，如：番茄、鸡蛋..."
            className="w-full px-4 py-3 pr-12 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleAdd(input)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 已选食材 */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {ingredients.map((ing) => (
            <div
              key={ing}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
            >
              <span>{ing}</span>
              <button
                onClick={() => onRemove(ing)}
                className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
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
                className="px-3 py-1.5 bg-white border-2 border-orange-200 text-orange-700 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-300 transition-all"
              >
                {ing}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
