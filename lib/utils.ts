import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS 类名合并
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成分享 URL
export function generateShareUrl(
  ingredients: string[],
  recipeIds: string[]
): string {
  const params = new URLSearchParams({
    ing: ingredients.join(','),
    recipes: recipeIds.join(',')
  });
  return `${window.location.origin}?${params.toString()}`;
}

// 解析分享 URL
export function parseShareUrl(): { ingredients: string[]; recipeIds: string[] } {
  if (typeof window === 'undefined') {
    return { ingredients: [], recipeIds: [] };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    ingredients: params.get('ing')?.split(',').filter(Boolean) || [],
    recipeIds: params.get('recipes')?.split(',').filter(Boolean) || []
  };
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// 格式化时间
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

// 获取食材分类
export function getIngredientCategory(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  if (lower.includes('番茄') || lower.includes('土豆') || lower.includes('菜') ||
      lower.includes('瓜') || lower.includes('萝卜') || lower.includes('葱') ||
      lower.includes('蒜') || lower.includes('姜') || lower.includes('椒') ||
      lower.includes('豆') || lower.includes('茄子') || lower.includes('洋葱')) {
    return 'vegetable';
  }
  if (lower.includes('肉') || lower.includes('鸡') || lower.includes('鸭') ||
      lower.includes('鱼') || lower.includes('虾') || lower.includes('蛋') ||
      lower.includes('奶')) {
    return 'meat';
  }
  if (lower.includes('盐') || lower.includes('糖') || lower.includes('油') ||
      lower.includes('酱') || lower.includes('醋') || lower.includes('酒') ||
      lower.includes('粉') || lower.includes('椒')) {
    return 'seasoning';
  }
  if (lower.includes('米') || lower.includes('面') || lower.includes('粉') ||
      lower.includes('包')) {
    return 'staple';
  }
  return 'other';
}

// 模糊匹配食材
export function matchIngredient(userIng: string, recipeIng: string): boolean {
  const userLower = userIng.toLowerCase().trim();
  const recipeLower = recipeIng.toLowerCase().trim();

  // 1. 完全匹配
  if (userLower === recipeLower) return true;

  // 2. 常见别名映射（精确匹配）
  const aliases: Record<string, string[]> = {
    '鸡蛋': ['蛋', '鸡蛋'],
    '鸭蛋': ['蛋', '鸭蛋'],
    '土豆': ['马铃薯', '洋芋'],
    '番茄': ['西红柿'],
    '柿子': ['番茄', '西红柿'],
    '辣椒': ['青椒', '红椒', '朝天椒'],
    '椒': ['青椒', '红椒', '辣椒'],
    '猪肉': ['肉', '猪肉', '五花肉'],
    '牛肉': ['肉', '牛肉', '牛腩'],
    '羊肉': ['肉', '羊肉'],
    '鸡肉': ['肉', '鸡肉', '鸡'],
    '鱼': ['鱼', '鱼片'],
  };

  // 检查是否在别名映射中
  for (const [key, values] of Object.entries(aliases)) {
    // 如果用户输入或菜谱食材是 key 的变体
    if (values.includes(userLower) && values.includes(recipeLower)) {
      return true; // 它们在同一个别名组中
    }
    if (userLower === key && values.includes(recipeLower)) {
      return true;
    }
    if (recipeLower === key && values.includes(userLower)) {
      return true;
    }
  }

  // 3. 包含关系（但更谨慎，避免误匹配）
  // 只有当一方是另一方的前缀或后缀时才匹配
  if (userLower.length > 1 && recipeLower.length > 1) {
    // 用户输入是菜谱食材的子串
    if (recipeLower.includes(userLower) && userLower.length >= 2) {
      // 确保不会匹配到完全不同的食材
      const excludePatterns = ['肉', '菜', '豆', '粉', '瓜', '椒', '蛋'];
      const isGeneric = excludePatterns.some(p => userLower === p);
      if (!isGeneric) return true;
    }
    // 菜谱食材是用户输入的子串
    if (userLower.includes(recipeLower) && recipeLower.length >= 2) {
      const excludePatterns = ['肉', '菜', '豆', '粉', '瓜', '椒', '蛋'];
      const isGeneric = excludePatterns.some(p => recipeLower === p);
      if (!isGeneric) return true;
    }
  }

  return false;
}
