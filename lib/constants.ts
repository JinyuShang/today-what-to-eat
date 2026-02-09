/**
 * 应用常量配置
 * 统一管理所有魔法字符串和数字
 */

// ============= LocalStorage Keys =============
export const STORAGE_KEYS = {
  /** 用户食材库存 */
  PANTRY_ITEMS: 'pantry-items',

  /** 菜单项目 */
  MENU_ITEMS: 'menu-items',

  /** 购物清单 */
  SHOPPING_LIST: 'shopping-list',

  /** 人数设置 */
  SERVINGS: 'servings',

  /** 用户数据（收藏+历史） */
  USER_DATA: 'today-what-to-eat',

  /** 已购买的食材 */
  PURCHASED_INGREDIENTS: 'purchased-ingredients',
} as const;

// ============= Custom Event Names =============
export const EVENT_NAMES = {
  /** 库存更新事件 */
  PANTRY_UPDATED: 'pantry-updated',

  /** 菜单变化事件 */
  MENU_CHANGED: 'menu-changed',

  /** 收藏变化事件 */
  FAVORITE_CHANGED: 'favorite-changed',

  /** 打开购物清单事件 */
  OPEN_SHOPPING_LIST: 'open-shopping-list',

  /** 重置购物清单事件 */
  RESET_SHOPPING_LIST: 'reset-shopping-list',

  /** 食材已购买事件 */
  INGREDIENTS_PURCHASED: 'ingredients-purchased',

  /** 菜谱需要更新事件 */
  RECIPES_NEED_UPDATE: 'recipes-need-update',
} as const;

// ============= URL Parameters =============
export const URL_PARAMS = {
  /** 食材参数名 */
  INGREDIENTS: 'ing',

  /** 菜谱ID参数名 */
  RECIPES: 'recipes',
} as const;

// ============= Numeric Constants =============
export const NUMERIC = {
  /** 匹配度阈值 (0-1) */
  MIN_MATCH_THRESHOLD: 0.5,

  /** 历史记录最大数量 */
  MAX_HISTORY_ENTRIES: 50,

  /** Toast 显示时长 (毫秒) */
  TOAST_DURATION: 2000,

  /** 最小触摸目标尺寸 (像素) - iOS 标准 */
  MIN_TOUCH_TARGET: 44,

  /** 推荐触摸目标尺寸 (像素) */
  RECOMMENDED_TOUCH_TARGET: 48,

  /** 克到千克换算 */
  GRAMS_PER_KILOGRAM: 1000,

  /** 默认食材量 (克) */
  DEFAULT_INGREDIENT_GRAMS: 100,

  /** 最大人数 */
  MAX_SERVINGS: 6,

  /** 推荐菜谱数量 */
  FEATURED_COUNT: 5,

  /** 最大食材名称长度 */
  MAX_INGREDIENT_LENGTH: 50,

  /** 快捷食材最大显示数 */
  MAX_QUICK_INGREDIENTS: 15,

  /** 随机排序因子 */
  RANDOM_SORT_FACTOR: 0.5,
} as const;

// ============= Error Messages =============
export const ERROR_MESSAGES = {
  /** LocalStorage 配额超限 */
  QUOTA_EXCEEDED: '存储空间不足，请清理部分数据',

  /** LocalStorage 不可用 */
  STORAGE_UNAVAILABLE: '浏览器存储功能不可用',

  /** 食材名称过长 */
  INGREDIENT_TOO_LONG: `食材名称不能超过 ${NUMERIC.MAX_INGREDIENT_LENGTH} 个字符`,

  /** 网络错误 */
  NETWORK_ERROR: '网络连接失败，请检查网络设置',

  /** 数据损坏 */
  DATA_CORRUPTED: '数据损坏，请刷新页面重试',
} as const;

// ============= Category Names =============
export const CATEGORY_NAMES = {
  vegetable: '蔬菜',
  meat: '肉类',
  seasoning: '调料',
  staple: '主食',
  other: '其他',
} as const;
