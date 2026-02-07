import { UserData, RecipeHistoryEntry } from '@/types';

const STORAGE_KEY = 'today-what-to-eat';

// 获取用户数据
export function getUserData(): UserData {
  if (typeof window === 'undefined') {
    return { favorites: [], history: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load user data:', err);
  }

  return { favorites: [], history: [] };
}

// 保存用户数据
export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save user data:', err);
  }
}

// 添加收藏
export function addFavorite(recipeId: string): void {
  const data = getUserData();
  if (!data.favorites.includes(recipeId)) {
    data.favorites.push(recipeId);
    saveUserData(data);
  }
}

// 移除收藏
export function removeFavorite(recipeId: string): void {
  const data = getUserData();
  data.favorites = data.favorites.filter(id => id !== recipeId);
  saveUserData(data);
}

// 检查是否收藏
export function isFavorite(recipeId: string): boolean {
  const data = getUserData();
  return data.favorites.includes(recipeId);
}

// 添加历史记录
export function addHistory(recipeId: string): void {
  const data = getUserData();
  const entry: RecipeHistoryEntry = {
    recipeId,
    timestamp: Date.now()
  };

  // 添加到开头，限制最近 50 条
  data.history = [entry, ...data.history.filter(h => h.recipeId !== recipeId)].slice(0, 50);
  saveUserData(data);
}

// 获取历史记录
export function getHistory(limit = 10): RecipeHistoryEntry[] {
  const data = getUserData();
  return data.history.slice(0, limit);
}

// 清空数据
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
