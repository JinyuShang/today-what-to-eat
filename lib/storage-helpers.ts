/**
 * 类型安全的 LocalStorage 工具函数
 * 提供 JSON.parse 和 JSON.stringify 的异常处理
 */

import { STORAGE_KEYS } from './constants';

/**
 * 类型安全的 JSON 解析
 * @param json - JSON 字符串
 * @param fallback - 解析失败时的默认值
 * @returns 解析结果或默认值
 */
export function safeParse<T>(json: string | null | undefined, fallback: T): T {
  if (json === null || json === undefined) {
    return fallback;
  }

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * 类型安全的 LocalStorage 读取
 * @param key - Storage key
 * @param fallback - 读取失败时的默认值
 * @returns 解析后的数据或默认值
 */
export function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const item = localStorage.getItem(key);
    return safeParse(item, fallback);
  } catch (error) {
    console.error(`LocalStorage read error for key "${key}":`, error);
    return fallback;
  }
}

/**
 * 类型安全的 LocalStorage 写入
 * @param key - Storage key
 * @param value - 要存储的值
 * @returns 是否成功写入
 */
export function safeSetItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // 检查是否是配额超限错误
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded:', error);
      // 可以在这里添加清理旧数据的逻辑
      return false;
    }
    console.error(`LocalStorage write error for key "${key}":`, error);
    return false;
  }
}

/**
 * 获取用户食材列表（带默认值）
 */
export function getPantryItems(): string[] {
  return safeGetItem<string[]>(STORAGE_KEYS.PANTRY_ITEMS, []);
}

/**
 * 保存用户食材列表
 */
export function setPantryItems(items: string[]): boolean {
  return safeSetItem(STORAGE_KEYS.PANTRY_ITEMS, items);
}

/**
 * 获取菜单项目（带默认值）
 */
export function getMenuItems(): any[] {
  return safeGetItem<any[]>(STORAGE_KEYS.MENU_ITEMS, []);
}

/**
 * 保存菜单项目
 */
export function setMenuItems(items: any[]): boolean {
  return safeSetItem(STORAGE_KEYS.MENU_ITEMS, items);
}

/**
 * 获取购物清单（带默认值）
 */
export function getShoppingList(): any[] {
  return safeGetItem<any[]>(STORAGE_KEYS.SHOPPING_LIST, []);
}

/**
 * 获取人数设置（带默认值）
 */
export function getServings(): number {
  const saved = localStorage.getItem(STORAGE_KEYS.SERVINGS);
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 20) {
      return parsed;
    }
  }
  return 2; // 默认 2 人
}

/**
 * 保存人数设置
 */
export function setServings(count: number): boolean {
  return safeSetItem(STORAGE_KEYS.SERVINGS, count);
}
