// 菜谱类型
export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: number; // 分钟
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image?: string;
  nutritionalInfo?: {
    calories: number; // 卡路里
    protein: string; // 蛋白质
    carbs: string; // 碳水化合物
    fat: string; // 脂肪
    servings: number; // 几人份
  };
}

// 匹配后的菜谱
export interface MatchedRecipe extends Recipe {
  matchScore: number; // 0-1 之间
  matchedIngredients: string[];
  missingIngredients: string[];
  canCook: boolean; // matchScore >= 0.5
}

// 用户数据
export interface UserData {
  favorites: string[]; // 收藏的菜谱 ID
  history: RecipeHistoryEntry[]; // 浏览历史
  sharedList?: SharedList; // 共享清单
}

export interface RecipeHistoryEntry {
  recipeId: string;
  timestamp: number;
}

// 共享清单
export interface SharedList {
  id: string;
  ingredients: string[];
  recipeIds: string[];
  createdAt: number;
}

// 购物清单项
export interface ShoppingItem {
  name: string;       // 完整名称，可能包含用量（如"番茄 300g"）
  pureName?: string;  // 纯食材名称（如"番茄"），用于分类和匹配
  category: 'vegetable' | 'meat' | 'seasoning' | 'staple' | 'other';
  checked: boolean;
  recipeId?: string;
}

// 食材分类
export const INGREDIENT_CATEGORIES = {
  vegetable: ['番茄', '土豆', '白菜', '胡萝卜', '黄瓜', '茄子', '青椒', '洋葱', '韭菜', '豆角', '芹菜', '菠菜', '生菜', '西兰花', '冬瓜', '南瓜'],
  meat: ['猪肉', '牛肉', '羊肉', '鸡肉', '鸭肉', '鱼', '虾', '鸡蛋', '豆腐'],
  seasoning: ['盐', '糖', '醋', '酱油', '料酒', '蚝油', '豆瓣酱', '胡椒粉', '辣椒', '蒜', '姜', '葱'],
  staple: ['大米', '面条', '面粉', '面包', '粉丝', '粉条'],
  other: ['牛奶', '酸奶', '黄油', '芝士', '花生', '芝麻']
} as const;

// 难度显示文本
export const DIFFICULTY_TEXT = {
  easy: '简单',
  medium: '中等',
  hard: '较难'
} as const;

// 分类显示文本
export const CATEGORY_TEXT = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '小食'
} as const;
