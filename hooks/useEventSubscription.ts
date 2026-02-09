/**
 * useEventSubscription Hook
 * 统一管理自定义事件订阅
 */

import { useEffect, useRef } from 'react';
import { EVENT_NAMES } from '@/lib/constants';

/**
 * 事件监听器类型
 */
type EventListener = (event: Event | CustomEvent) => void;

/**
 * 订阅单个事件
 * @param eventName - 事件名称（建议使用 EVENT_NAMES 常量）
 * @param handler - 事件处理函数
 * @param deps - 依赖数组（当依赖变化时重新绑定监听器）
 */
export function useEventSubscription(
  eventName: string,
  handler: EventListener,
  deps: any[] = []
) {
  // 使用 ref 保存最新的 handler，避免依赖变化时频繁绑定/解绑
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const eventListener = (event: Event) => {
      handlerRef.current(event);
    };

    window.addEventListener(eventName, eventListener);

    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName, ...deps]);
}

/**
 * 订阅多个事件
 * @param eventMap - 事件名和处理函数的映射对象
 * @param deps - 依赖数组
 */
export function useEventSubscriptions(
  eventMap: Record<string, EventListener>,
  deps: any[] = []
) {
  const handlersRef = useRef<Record<string, EventListener>>(eventMap);

  useEffect(() => {
    handlersRef.current = eventMap;
  }, [eventMap]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const listeners: Array<{ eventName: string; listener: EventListener }> = [];

    Object.entries(eventMap).forEach(([eventName, handler]) => {
      const eventListener = (event: Event) => {
        handler(event);
      };

      window.addEventListener(eventName, eventListener);
      listeners.push({ eventName, listener: eventListener });
    });

    return () => {
      listeners.forEach(({ eventName, listener }) => {
        window.removeEventListener(eventName, listener);
      });
    };
  }, [Object.keys(eventMap), ...deps]);
}

/**
 * 订阅特定的应用事件
 * 提供类型安全的事件订阅
 */
export function useAppEventSubscriptions(handlers: {
  onPantryUpdated?: (event: Event) => void;
  onMenuChanged?: (event: Event) => void;
  onFavoriteChanged?: (event: CustomEvent) => void;
  onOpenShoppingList?: (event: Event) => void;
  onResetShoppingList?: (event: Event) => void;
  onIngredientsPurchased?: (event: Event) => void;
  onRecipesNeedUpdate?: (event: Event) => void;
}, deps: any[] = []) {
  useEventSubscriptions({
    ...(handlers.onPantryUpdated && {
      [EVENT_NAMES.PANTRY_UPDATED]: handlers.onPantryUpdated
    }),
    ...(handlers.onMenuChanged && {
      [EVENT_NAMES.MENU_CHANGED]: handlers.onMenuChanged
    }),
    ...(handlers.onFavoriteChanged && {
      [EVENT_NAMES.FAVORITE_CHANGED]: handlers.onFavoriteChanged as EventListener
    }),
    ...(handlers.onOpenShoppingList && {
      [EVENT_NAMES.OPEN_SHOPPING_LIST]: handlers.onOpenShoppingList
    }),
    ...(handlers.onResetShoppingList && {
      [EVENT_NAMES.RESET_SHOPPING_LIST]: handlers.onResetShoppingList
    }),
    ...(handlers.onIngredientsPurchased && {
      [EVENT_NAMES.INGREDIENTS_PURCHASED]: handlers.onIngredientsPurchased
    }),
    ...(handlers.onRecipesNeedUpdate && {
      [EVENT_NAMES.RECIPES_NEED_UPDATE]: handlers.onRecipesNeedUpdate
    }),
  }, deps);
}

/**
 * 触发自定义事件
 * @param eventName - 事件名称
 * @param detail - 事件详情数据
 */
export function dispatchAppEvent(eventName: string, detail?: any) {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
}

/**
 * 预定义的应用事件触发器
 */
export const appEventDispatchers = {
  pantryUpdated: () => dispatchAppEvent(EVENT_NAMES.PANTRY_UPDATED),
  menuChanged: () => dispatchAppEvent(EVENT_NAMES.MENU_CHANGED),
  favoriteChanged: (recipeId: string) =>
    dispatchAppEvent(EVENT_NAMES.FAVORITE_CHANGED, { recipeId }),
  openShoppingList: () => dispatchAppEvent(EVENT_NAMES.OPEN_SHOPPING_LIST),
  resetShoppingList: () => dispatchAppEvent(EVENT_NAMES.RESET_SHOPPING_LIST),
  ingredientsPurchased: () => dispatchAppEvent(EVENT_NAMES.INGREDIENTS_PURCHASED),
  recipesNeedUpdate: () => dispatchAppEvent(EVENT_NAMES.RECIPES_NEED_UPDATE),
};
