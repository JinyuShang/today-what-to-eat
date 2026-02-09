/**
 * Storage Service
 * 统一的 LocalStorage 管理服务
 * 提供类型安全、带错误处理的数据持久化功能
 */

import { STORAGE_KEYS } from '@/lib/constants';

/**
 * 通用存储服务类
 */
class StorageService {
  /**
   * 获取数据
   */
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') {
      return fallback;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`StorageService.get() error for key "${key}":`, error);
      return fallback;
    }
  }

  /**
   * 设置数据
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('StorageService.set() - QuotaExceededError:', key);
        // 可以在这里添加清理旧数据的逻辑
        return false;
      }
      console.error(`StorageService.set() error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * 删除数据
   */
  remove(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageService.remove() error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  clear(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('StorageService.clear() error:', error);
      return false;
    }
  }

  /**
   * 检查 key 是否存在
   */
  has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`StorageService.has() error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * 获取所有 keys
   */
  keys(): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('StorageService.keys() error:', error);
      return [];
    }
  }
}

// 单例实例
export const storageService = new StorageService();

/**
 * 应用特定的存储 API
 * 提供类型安全的数据访问方法
 */

// 食材库存相关
export const pantryStorage = {
  get: (): string[] => storageService.get(STORAGE_KEYS.PANTRY_ITEMS, []),
  set: (items: string[]): boolean => storageService.set(STORAGE_KEYS.PANTRY_ITEMS, items),
  add: (item: string): boolean => {
    const items = pantryStorage.get();
    if (!items.includes(item)) {
      items.push(item);
      return pantryStorage.set(items);
    }
    return true;
  },
  remove: (item: string): boolean => {
    const items = pantryStorage.get().filter(i => i !== item);
    return pantryStorage.set(items);
  },
  clear: (): boolean => storageService.remove(STORAGE_KEYS.PANTRY_ITEMS),
};

// 菜单相关
import { MenuItem } from '@/types';

export const menuStorage = {
  get: (): MenuItem[] => storageService.get(STORAGE_KEYS.MENU_ITEMS, []),
  set: (items: MenuItem[]): boolean => storageService.set(STORAGE_KEYS.MENU_ITEMS, items),
  add: (item: MenuItem): boolean => {
    const items = menuStorage.get();
    items.unshift(item); // 添加到开头
    return menuStorage.set(items);
  },
  remove: (recipeId: string): boolean => {
    const items = menuStorage.get().filter(item => item.recipe.id !== recipeId);
    return menuStorage.set(items);
  },
  has: (recipeId: string): boolean => {
    return menuStorage.get().some(item => item.recipe.id === recipeId);
  },
  clear: (): boolean => storageService.remove(STORAGE_KEYS.MENU_ITEMS),
};

// 购物清单相关
import { ShoppingItem } from '@/types';

export const shoppingListStorage = {
  get: (): ShoppingItem[] => storageService.get(STORAGE_KEYS.SHOPPING_LIST, []),
  set: (items: ShoppingItem[]): boolean => storageService.set(STORAGE_KEYS.SHOPPING_LIST, items),
  add: (items: ShoppingItem[]): boolean => {
    const current = shoppingListStorage.get();
    // 去重：根据 pureName 或 name
    const existing = current.map(item => item.pureName || item.name);
    const newItems = items.filter(item => !existing.includes(item.pureName || item.name));
    return shoppingList.set([...current, ...newItems]);
  },
  update: (index: number, item: ShoppingItem): boolean => {
    const current = shoppingListStorage.get();
    current[index] = item;
    return shoppingList.set(current);
  },
  remove: (index: number): boolean => {
    const current = shoppingListStorage.get();
    current.splice(index, 1);
    return shoppingList.set(current);
  },
  clear: (): boolean => storageService.remove(STORAGE_KEYS.SHOPPING_LIST),
};

// 人数设置相关
export const servingsStorage = {
  get: (): number => {
    const saved = storageService.get<number>(STORAGE_KEYS.SERVINGS, 2);
    return saved > 0 && saved <= 20 ? saved : 2;
  },
  set: (count: number): boolean => storageService.set(STORAGE_KEYS.SERVINGS, count),
};

// 用户数据相关（收藏+历史）
import { UserData } from '@/types';

export const userDataStorage = {
  get: (): UserData => storageService.get(STORAGE_KEYS.USER_DATA, { favorites: [], history: [] }),
  set: (data: UserData): boolean => storageService.set(STORAGE_KEYS.USER_DATA, data),
};

// 已购买食材相关
export const purchasedStorage = {
  get: (): Set<string> => {
    const items = storageService.get<string[]>(STORAGE_KEYS.PURCHASED_INGREDIENTS, []);
    return new Set(items);
  },
  set: (items: Set<string>): boolean => storageService.set(STORAGE_KEYS.PURCHASED_INGREDIENTS, Array.from(items)),
  add: (item: string): boolean => {
    const current = purchasedStorage.get();
    current.add(item);
    return purchasedStorage.set(current);
  },
  remove: (item: string): boolean => {
    const current = purchasedStorage.get();
    current.delete(item);
    return purchasedStorage.set(current);
  },
  has: (item: string): boolean => purchasedStorage.get().has(item),
  clear: (): boolean => storageService.remove(STORAGE_KEYS.PURCHASED_INGREDIENTS),
};

/**
 * 导出所有存储 API
 */
export const storage = {
  pantry: pantryStorage,
  menu: menuStorage,
  shoppingList: shoppingListStorage,
  servings: servingsStorage,
  userData: userDataStorage,
  purchased: purchasedStorage,
  service: storageService,
};

export default storage;
