/**
 * useLocalStorage Hook
 * 类型安全的 LocalStorage 状态管理 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage-helpers';

/**
 * 使用 LocalStorage 管理状态
 * @param key - Storage key
 * @param initialValue - 初始值（当 localStorage 无数据时使用）
 * @returns [value, setValue, isReady] - 状态值、设置函数、是否已加载
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // 从 localStorage 初始化状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return safeGetItem(key, initialValue);
  });

  const [isReady, setIsReady] = useState(false);

  // 组件挂载后标记为 ready
  useEffect(() => {
    setIsReady(true);
  }, []);

  // 设置状态并同步到 localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        safeSetItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isReady];
}

/**
 * 使用 LocalStorage 管理数组状态
 * 提供便捷的数组操作方法
 */
export function useLocalStorageArray<T>(key: string, initialValue: T[]) {
  const [items, setItems, isReady] = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, [setItems]);

  const removeItem = useCallback((item: T) => {
    setItems(prev => prev.filter(i => i !== item));
  }, [setItems]);

  const updateItem = useCallback((index: number, newItem: T) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = newItem;
      return next;
    });
  }, [setItems]);

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    isReady,
  };
}

/**
 * 使用 LocalStorage 管理集合状态
 * 提供便捷的 Set 操作方法
 */
export function useLocalStorageSet<T>(key: string, initialValue: Set<T> = new Set()) {
  const [items, setItems, isReady] = useLocalStorage<Set<T>>(key, initialValue);

  const add = useCallback((item: T) => {
    setItems(prev => new Set(prev).add(item));
  }, [setItems]);

  const remove = useCallback((item: T) => {
    setItems(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, [setItems]);

  const toggle = useCallback((item: T) => {
    setItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, [setItems]);

  const has = useCallback((item: T) => items.has(item), [items]);

  const clear = useCallback(() => {
    setItems(new Set());
  }, [setItems]);

  return {
    items,
    setItems,
    add,
    remove,
    toggle,
    has,
    clear,
    isReady,
  };
}
