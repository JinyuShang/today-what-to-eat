import { MatchedRecipe } from './index';

/**
 * 全局 Window 接口扩展
 * 用于类型安全的跨组件通信
 */
declare global {
  interface Window {
    /**
     * 添加菜谱到菜单
     * @param recipe - 要添加的菜谱
     */
    addRecipeToMenu?: (recipe: MatchedRecipe) => void;

    /**
     * 添加食材到购物清单
     * @param items - 食材名称数组
     */
    addShoppingItems?: (items: string[]) => void;
  }
}

// 使声明成为全局模块
export {};
