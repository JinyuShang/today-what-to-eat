/**
 * useToggleSet Hook
 * 管理可选择项的 Hook（用于多选功能）
 */

import { useState, useCallback } from 'react';

/**
 * 管理可选择项集合
 * @param initialItems - 初始选项列表
 * @returns 选择状态和操作方法
 */
export function useToggleSet<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<Set<T>>(new Set(initialItems));

  /**
   * 切换选项状态
   */
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
  }, []);

  /**
   * 添加选项
   */
  const add = useCallback((item: T) => {
    setItems(prev => new Set(prev).add(item));
  }, []);

  /**
   * 移除选项
   */
  const remove = useCallback((item: T) => {
    setItems(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  /**
   * 检查是否包含某个选项
   */
  const has = useCallback((item: T) => items.has(item), [items]);

  /**
   * 清空所有选项
   */
  const clear = useCallback(() => {
    setItems(new Set());
  }, []);

  /**
   * 批量设置选项
   */
  const setAll = useCallback((newItems: T[]) => {
    setItems(new Set(newItems));
  }, []);

  /**
   * 获取选项数组
   */
  const toArray = useCallback(() => Array.from(items), [items]);

  /**
   * 选项数量
   */
  const size = items.size;

  return {
    items,
    setItems,
    toggle,
    add,
    remove,
    has,
    clear,
    setAll,
    toArray,
    size,
  };
}

/**
 * 管理带分组的选择项集合
 * 用于按类别选择食材等场景
 */
export function useGroupedToggleSet<T extends string>(
  initialItems: T[] = [],
  groups: Record<string, T[]> = {}
) {
  const { items, toggle, add, remove, has, clear, setAll, toArray, size } = useToggleSet<T);

  /**
   * 按组切换选项
   */
  const toggleGroup = useCallback((groupKey: string) => {
    const groupItems = groups[groupKey];
    if (!groupItems) return;

    // 检查组内是否全部已选
    const allSelected = groupItems.every(item => has(item));

    if (allSelected) {
      // 全部取消选中
      groupItems.forEach(item => remove(item));
    } else {
      // 全部选中
      groupItems.forEach(item => add(item));
    }
  }, [groups, has, add, remove]);

  /**
   * 检查组内是否全部已选
   */
  const isGroupFullySelected = useCallback((groupKey: string) => {
    const groupItems = groups[groupKey];
    if (!groupItems || groupItems.length === 0) return false;
    return groupItems.every(item => has(item));
  }, [groups, has]);

  /**
   * 检查组内是否部分已选
   */
  const isGroupPartiallySelected = useCallback((groupKey: string) => {
    const groupItems = groups[groupKey];
    if (!groupItems || groupItems.length === 0) return false;
    return groupItems.some(item => has(item)) && !isGroupFullySelected(groupKey);
  }, [groups, has, isGroupFullySelected]);

  /**
   * 获取组内已选项数量
   */
  const getGroupSelectedCount = useCallback((groupKey: string) => {
    const groupItems = groups[groupKey];
    if (!groupItems) return 0;
    return groupItems.filter(item => has(item)).length;
  }, [groups, has]);

  return {
    items,
    toggle,
    toggleGroup,
    add,
    remove,
    has,
    clear,
    setAll,
    toArray,
    size,
    isGroupFullySelected,
    isGroupPartiallySelected,
    getGroupSelectedCount,
  };
}
