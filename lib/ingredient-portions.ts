// 食材用量映射（每人的标准用量）
export const INGREDIENT_PORTIONS: Record<string, { amount: number; unit: string }> = {
  // 蔬菜类
  '番茄': { amount: 150, unit: 'g' },
  '西红柿': { amount: 150, unit: 'g' },
  '鸡蛋': { amount: 2, unit: '个' },
  '土豆': { amount: 200, unit: 'g' },
  '青椒': { amount: 1, unit: '个' },
  '红椒': { amount: 1, unit: '个' },
  '洋葱': { amount: 100, unit: 'g' },
  '胡萝卜': { amount: 80, unit: 'g' },
  '白萝卜': { amount: 150, unit: 'g' },
  '白菜': { amount: 200, unit: 'g' },
  '包菜': { amount: 200, unit: 'g' },
  '生菜': { amount: 100, unit: 'g' },
  '菠菜': { amount: 100, unit: 'g' },
  '油菜': { amount: 100, unit: 'g' },
  '西兰花': { amount: 150, unit: 'g' },
  '菜花': { amount: 150, unit: 'g' },
  '蒜': { amount: 2, unit: '瓣' },
  '蒜瓣': { amount: 2, unit: '瓣' },
  '姜': { amount: 10, unit: 'g' },
  '生姜': { amount: 10, unit: 'g' },
  '葱': { amount: 1, unit: '根' },
  '大葱': { amount: 1, unit: '根' },
  '小葱': { amount: 2, unit: '根' },
  '韭菜': { amount: 50, unit: 'g' },
  '豆角': { amount: 150, unit: 'g' },
  '四季豆': { amount: 150, unit: 'g' },
  '茄子': { amount: 200, unit: 'g' },
  '黄瓜': { amount: 1, unit: '根' },
  '丝瓜': { amount: 1, unit: '根' },
  '冬瓜': { amount: 200, unit: 'g' },
  '南瓜': { amount: 200, unit: 'g' },
  '西葫芦': { amount: 200, unit: 'g' },
  '豆腐': { amount: 200, unit: 'g' },
  '豆干': { amount: 100, unit: 'g' },
  '腐竹': { amount: 50, unit: 'g' },
  '木耳': { amount: 5, unit: 'g' },
  '香菇': { amount: 3, unit: '个' },
  '金针菇': { amount: 100, unit: 'g' },
  '平菇': { amount: 100, unit: 'g' },

  // 肉类
  '猪肉': { amount: 150, unit: 'g' },
  '五花肉': { amount: 150, unit: 'g' },
  '瘦肉': { amount: 150, unit: 'g' },
  '牛肉': { amount: 150, unit: 'g' },
  '牛腩': { amount: 200, unit: 'g' },
  '羊肉': { amount: 150, unit: 'g' },
  '鸡肉': { amount: 150, unit: 'g' },
  '鸡翅': { amount: 3, unit: '个' },
  '鸡腿': { amount: 2, unit: '个' },
  '鸭肉': { amount: 150, unit: 'g' },
  '排骨': { amount: 200, unit: 'g' },
  '猪排': { amount: 200, unit: 'g' },
  '鱼': { amount: 200, unit: 'g' },
  '带鱼': { amount: 250, unit: 'g' },
  '鲤鱼': { amount: 300, unit: 'g' },
  '草鱼': { amount: 300, unit: 'g' },
  '鲫鱼': { amount: 250, unit: 'g' },
  '虾': { amount: 100, unit: 'g' },
  '虾仁': { amount: 100, unit: 'g' },

  // 调料
  '盐': { amount: 3, unit: 'g' },
  '白糖': { amount: 5, unit: 'g' },
  '红糖': { amount: 5, unit: 'g' },
  '冰糖': { amount: 5, unit: 'g' },
  '酱油': { amount: 15, unit: 'ml' },
  '生抽': { amount: 15, unit: 'ml' },
  '老抽': { amount: 10, unit: 'ml' },
  '醋': { amount: 10, unit: 'ml' },
  '料酒': { amount: 10, unit: 'ml' },
  '蚝油': { amount: 10, unit: 'ml' },
  '豆瓣酱': { amount: 10, unit: 'g' },
  '郫县豆瓣': { amount: 10, unit: 'g' },
  '番茄酱': { amount: 15, unit: 'g' },
  '胡椒粉': { amount: 1, unit: 'g' },
  '辣椒': { amount: 2, unit: '个' },
  '干辣椒': { amount: 5, unit: '个' },
  '花椒': { amount: 1, unit: 'g' },
  '八角': { amount: 1, unit: '个' },
  '桂皮': { amount: 1, unit: 'g' },
  '香叶': { amount: 1, unit: '片' },
  '淀粉': { amount: 5, unit: 'g' },
  '玉米淀粉': { amount: 5, unit: 'g' },
  '生粉': { amount: 5, unit: 'g' },

  // 主食
  '大米': { amount: 100, unit: 'g' },
  '糯米': { amount: 100, unit: 'g' },
  '面条': { amount: 100, unit: 'g' },
  '挂面': { amount: 100, unit: 'g' },
  '河粉': { amount: 150, unit: 'g' },
  '意面': { amount: 100, unit: 'g' },
  '面粉': { amount: 100, unit: 'g' },
  '中筋面粉': { amount: 100, unit: 'g' },
  '低筋面粉': { amount: 100, unit: 'g' },
  '面包': { amount: 2, unit: '片' },
  '吐司': { amount: 2, unit: '片' },
};

// 根据人数计算食材用量
export function calculateIngredientAmount(
  ingredient: string,
  servings: number
): string {
  // 尝试精确匹配
  let portion = INGREDIENT_PORTIONS[ingredient];

  // 如果没有精确匹配，尝试部分匹配（包含关键词）
  if (!portion) {
    for (const [key, value] of Object.entries(INGREDIENT_PORTIONS)) {
      if (ingredient.includes(key) || key.includes(ingredient)) {
        portion = value;
        break;
      }
    }
  }

  // 如果找到匹配，计算用量
  if (portion) {
    const totalAmount = portion.amount * servings;

    // 格式化显示
    if (totalAmount >= 1000 && portion.unit === 'g') {
      const kg = (totalAmount / 1000).toFixed(1);
      return `${ingredient} ${kg.endsWith('.0') ? kg.slice(0, -2) : kg}kg`;
    } else if (totalAmount >= 500 && portion.unit === 'ml') {
      const L = (totalAmount / 1000).toFixed(1);
      return `${ingredient} ${L.endsWith('.0') ? L.slice(0, -2) : L}L`;
    } else {
      // 整数不显示小数点
      const displayAmount = Number.isInteger(totalAmount) ? totalAmount : totalAmount.toFixed(1);
      return `${ingredient} ${displayAmount}${portion.unit}`;
    }
  }

  // 没有映射的食材，使用估算值
  // 判断是否是按个计算的（常见的可数食材）
  const countableIngredients = ['鸡蛋', '鸡翅', '鸡腿', '虾', '鱼', '番茄', '土豆', '洋葱', '豆腐', '辣椒'];
  const isCountable = countableIngredients.some(key => ingredient.includes(key));

  if (isCountable) {
    // 按个计算
    const count = Math.max(1, Math.round(servings));
    return `${ingredient} ${count}个`;
  } else {
    // 按重量计算（默认150g每人）
    const defaultAmount = 150 * servings;
    if (defaultAmount >= 1000) {
      const kg = (defaultAmount / 1000).toFixed(1);
      return `${ingredient} ${kg.endsWith('.0') ? kg.slice(0, -2) : kg}kg`;
    }
    return `${ingredient} ${defaultAmount}g`;
  }
}

// 获取食材的分类采购建议
export function getShoppingTips(ingredients: string[], servings: number): string[] {
  const tips: string[] = [];

  // 根据食材类型给出建议
  const hasVegetables = ingredients.some(i =>
    ['番茄', '土豆', '青椒', '白菜', '黄瓜', '西兰花'].some(v => i.includes(v))
  );

  const hasMeat = ingredients.some(i =>
    ['猪肉', '牛肉', '鸡肉', '鱼', '虾', '排骨'].some(m => i.includes(m))
  );

  if (hasMeat) {
    tips.push('🥩 肉类建议新鲜采购，当天食用最佳');
  }

  if (hasVegetables) {
    tips.push('🥬 蔬菜建议当天购买，保持新鲜口感');
  }

  if (servings >= 4) {
    tips.push('🛒 采购量较大，建议使用购物车或提前预订');
  }

  if (ingredients.length > 10) {
    tips.push('📋 建议按类别采购，避免遗漏');
  }

  return tips;
}
