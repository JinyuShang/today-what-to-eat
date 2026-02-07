import { Recipe } from '@/types';

// Unsplash 食物图片映射
export const RECIPE_IMAGES: Record<string, string> = {
  // 早餐
  '番茄炒蛋': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  '西红柿炒鸡蛋': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  '牛奶鸡蛋吐司': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
  '燕麦粥': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
  '煎蛋': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
  '包子': 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400',
  '油条': 'https://images.unsplash.com/photo-1621236378699-8597af918252?w=400',
  '豆浆': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',

  // 主菜 - 肉类
  '宫保鸡丁': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
  '麻婆豆腐': 'https://images.unsplash.com/photo-1634157703702-3c124b455499?w=400',
  '红烧肉': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
  '糖醋排骨': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
  '鱼香肉丝': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  '土豆炖牛肉': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
  '清蒸鱼': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
  '回锅肉': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
  '水煮鱼': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
  '辣子鸡': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
  '青椒肉丝': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
  '红烧排骨': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
  '红烧鸡翅': 'https://images.unsplash.com/photo-1606084672544-5b7e6d0733f0?w=400',
  '蒜蓉蒸虾': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
  '可乐鸡翅': 'https://images.unsplash.com/photo-1606084672544-5b7e6d0733f0?w=400',
  '黄焖鸡': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',

  // 主菜 - 素菜
  '酸辣土豆丝': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
  '青椒土豆丝': 'https://images.unsplash.com/photo-1567874279719-7616215d8c0e?w=400',
  '地三鲜': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
  '干煸豆角': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
  '蒜蓉西兰花': 'https://images.unsplash.com/photo-1457418862662-8eb0e95c0e09?w=400',
  '凉拌黄瓜': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
  '蚝油生菜': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  '干煸四季豆': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
  '西红柿炒鸡蛋': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  '醋溜白菜': 'https://images.unsplash.com/photo-1457418862662-8eb0e95c0e09?w=400',
  '清炒时蔬': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',

  // 汤类
  '番茄鸡蛋汤': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  '紫菜蛋花汤': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  '冬瓜排骨汤': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
  '银耳莲子汤': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
  '酸辣汤': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  '丝瓜蛋汤': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',

  // 面食
  '番茄鸡蛋面': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400',
  '牛肉面': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
  '炒饭': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  '蛋炒饭': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  '饺子': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
  '馄饨': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
  '炒面': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400',
  '意大利面': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',

  // 默认图片
  'default': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
};

// 营养信息映射（每100g或每份）
export const NUTRITION_INFO: Record<string, {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  servings: number;
}> = {
  // 早餐
  '番茄炒蛋': { calories: 180, protein: '12g', carbs: '8g', fat: '11g', servings: 2 },
  '西红柿炒鸡蛋': { calories: 180, protein: '12g', carbs: '8g', fat: '11g', servings: 2 },
  '牛奶鸡蛋吐司': { calories: 320, protein: '15g', carbs: '40g', fat: '12g', servings: 1 },
  '燕麦粥': { calories: 150, protein: '5g', carbs: '27g', fat: '3g', servings: 1 },
  '煎蛋': { calories: 140, protein: '12g', carbs: '1g', fat: '10g', servings: 1 },
  '包子': { calories: 200, protein: '8g', carbs: '35g', fat: '5g', servings: 3 },
  '油条': { calories: 380, protein: '6g', carbs: '50g', fat: '18g', servings: 2 },

  // 主菜 - 肉类
  '宫保鸡丁': { calories: 280, protein: '25g', carbs: '12g', fat: '15g', servings: 2 },
  '麻婆豆腐': { calories: 220, protein: '15g', carbs: '10g', fat: '14g', servings: 2 },
  '红烧肉': { calories: 450, protein: '20g', carbs: '8g', fat: '35g', servings: 3 },
  '糖醋排骨': { calories: 380, protein: '22g', carbs: '18g', fat: '24g', servings: 2 },
  '鱼香肉丝': { calories: 300, protein: '18g', carbs: '15g', fat: '16g', servings: 2 },
  '土豆炖牛肉': { calories: 320, protein: '28g', carbs: '22g', fat: '14g', servings: 3 },
  '清蒸鱼': { calories: 200, protein: '32g', carbs: '5g', fat: '8g', servings: 2 },
  '回锅肉': { calories: 420, protein: '22g', carbs: '10g', fat: '32g', servings: 3 },
  '水煮鱼': { calories: 350, protein: '28g', carbs: '12g', fat: '22g', servings: 3 },
  '辣子鸡': { calories: 380, protein: '30g', carbs: '15g', fat: '20g', servings: 3 },
  '青椒肉丝': { calories: 260, protein: '20g', carbs: '10g', fat: '14g', servings: 2 },
  '红烧排骨': { calories: 400, protein: '24g', carbs: '15g', fat: '26g', servings: 3 },
  '红烧鸡翅': { calories: 320, protein: '26g', carbs: '12g', fat: '18g', servings: 2 },
  '蒜蓉蒸虾': { calories: 180, protein: '28g', carbs: '6g', fat: '6g', servings: 2 },
  '可乐鸡翅': { calories: 350, protein: '24g', carbs: '18g', fat: '20g', servings: 2 },
  '黄焖鸡': { calories: 300, protein: '26g', carbs: '14g', fat: '16g', servings: 2 },

  // 主菜 - 素菜
  '酸辣土豆丝': { calories: 120, protein: '2g', carbs: '25g', fat: '3g', servings: 2 },
  '青椒土豆丝': { calories: 130, protein: '2g', carbs: '26g', fat: '4g', servings: 2 },
  '地三鲜': { calories: 180, protein: '4g', carbs: '30g', fat: '6g', servings: 2 },
  '干煸豆角': { calories: 140, protein: '4g', carbs: '18g', fat: '6g', servings: 2 },
  '蒜蓉西兰花': { calories: 90, protein: '5g', carbs: '8g', fat: '5g', servings: 2 },
  '凉拌黄瓜': { calories: 45, protein: '1g', carbs: '6g', fat: '2g', servings: 2 },
  '蚝油生菜': { calories: 60, protein: '2g', carbs: '6g', fat: '3g', servings: 2 },
  '干煸四季豆': { calories: 140, protein: '4g', carbs: '18g', fat: '6g', servings: 2 },
  '醋溜白菜': { calories: 70, protein: '2g', carbs: '10g', fat: '3g', servings: 2 },
  '清炒时蔬': { calories: 80, protein: '3g', carbs: '12g', fat: '3g', servings: 2 },

  // 汤类
  '番茄鸡蛋汤': { calories: 80, protein: '6g', carbs: '5g', fat: '4g', servings: 2 },
  '紫菜蛋花汤': { calories: 60, protein: '5g', carbs: '4g', fat: '3g', servings: 2 },
  '冬瓜排骨汤': { calories: 180, protein: '15g', carbs: '8g', fat: '10g', servings: 3 },
  '银耳莲子汤': { calories: 120, protein: '3g', carbs: '28g', fat: '0g', servings: 2 },
  '酸辣汤': { calories: 100, protein: '6g', carbs: '8g', fat: '5g', servings: 2 },
  '丝瓜蛋汤': { calories: 70, protein: '5g', carbs: '4g', fat: '4g', servings: 2 },

  // 面食
  '番茄鸡蛋面': { calories: 380, protein: '14g', carbs: '55g', fat: '12g', servings: 1 },
  '牛肉面': { calories: 450, protein: '20g', carbs: '60g', fat: '16g', servings: 1 },
  '炒饭': { calories: 400, protein: '12g', carbs: '55g', fat: '14g', servings: 1 },
  '蛋炒饭': { calories: 380, protein: '12g', carbs: '52g', fat: '13g', servings: 1 },
  '饺子': { calories: 250, protein: '10g', carbs: '35g', fat: '8g', servings: 2 },
  '馄饨': { calories: 280, protein: '12g', carbs: '38g', fat: '10g', servings: 2 },
  '炒面': { calories: 420, protein: '14g', carbs: '58g', fat: '16g', servings: 1 },
  '意大利面': { calories: 350, protein: '12g', carbs: '50g', fat: '12g', servings: 1 },
};

// 根据菜谱类型估算营养信息
function estimateNutrition(recipe: Recipe) {
  const name = recipe.name.toLowerCase();
  let baseCalories = 200;
  let baseProtein = '10g';
  let baseCarbs = '20g';
  let baseFat = '8g';

  // 根据食材和类型估算
  if (name.includes('鸡') || name.includes('鸭') || name.includes('鱼') || name.includes('虾')) {
    baseCalories = 280;
    baseProtein = '25g';
    baseCarbs = '10g';
    baseFat = '15g';
  } else if (name.includes('猪肉') || name.includes('牛肉') || name.includes('排骨')) {
    baseCalories = 380;
    baseProtein = '22g';
    baseCarbs = '12g';
    baseFat = '25g';
  } else if (name.includes('豆腐')) {
    baseCalories = 180;
    baseProtein = '12g';
    baseCarbs = '8g';
    baseFat = '12g';
  } else if (name.includes('面') || name.includes('饭')) {
    baseCalories = 400;
    baseProtein = '12g';
    baseCarbs = '55g';
    baseFat = '12g';
  } else if (name.includes('汤')) {
    baseCalories = 100;
    baseProtein = '6g';
    baseCarbs = '6g';
    baseFat = '4g';
  } else if (name.includes('饺子') || name.includes('馄饨')) {
    baseCalories = 250;
    baseProtein = '10g';
    baseCarbs = '35g';
    baseFat = '8g';
  } else if (name.includes('包子')) {
    baseCalories = 200;
    baseProtein = '8g';
    baseCarbs = '35g';
    baseFat = '5g';
  } else if (name.includes('土豆') || name.includes('白菜') || name.includes('黄瓜') || name.includes('西兰花')) {
    baseCalories = 100;
    baseProtein = '3g';
    baseCarbs = '18g';
    baseFat = '4g';
  }

  return {
    calories: baseCalories,
    protein: baseProtein,
    carbs: baseCarbs,
    fat: baseFat,
    servings: 2
  };
}

// 为菜谱添加图片和营养信息
export function enhanceRecipe(recipe: Recipe): Recipe {
  // 先尝试精确匹配菜名
  let image = RECIPE_IMAGES[recipe.name];

  // 如果没有精确匹配，根据关键词选择图片
  if (!image) {
    const name = recipe.name.toLowerCase();

    // 包含特定关键词的菜谱使用对应图片
    if (name.includes('鸡') && name.includes('丁')) {
      image = RECIPE_IMAGES['宫保鸡丁'];
    } else if (name.includes('鸡')) {
      image = RECIPE_IMAGES['黄焖鸡'];
    } else if (name.includes('豆腐')) {
      image = RECIPE_IMAGES['麻婆豆腐'];
    } else if (name.includes('猪肉') || name.includes('红烧肉')) {
      image = RECIPE_IMAGES['红烧肉'];
    } else if (name.includes('排骨')) {
      image = RECIPE_IMAGES['红烧排骨'];
    } else if (name.includes('鱼')) {
      image = RECIPE_IMAGES['清蒸鱼'];
    } else if (name.includes('虾')) {
      image = RECIPE_IMAGES['蒜蓉蒸虾'];
    } else if (name.includes('土豆') && name.includes('牛')) {
      image = RECIPE_IMAGES['土豆炖牛肉'];
    } else if (name.includes('土豆')) {
      image = RECIPE_IMAGES['酸辣土豆丝'];
    } else if (name.includes('西红柿') || name.includes('番茄')) {
      if (name.includes('汤') || name.includes('面')) {
        image = name.includes('面') ? RECIPE_IMAGES['番茄鸡蛋面'] : RECIPE_IMAGES['番茄鸡蛋汤'];
      } else {
        image = RECIPE_IMAGES['番茄炒蛋'];
      }
    } else if (name.includes('面')) {
      image = RECIPE_IMAGES['牛肉面'];
    } else if (name.includes('炒饭')) {
      image = RECIPE_IMAGES['炒饭'];
    } else if (name.includes('汤')) {
      image = RECIPE_IMAGES['冬瓜排骨汤'];
    } else if (name.includes('西兰花')) {
      image = RECIPE_IMAGES['蒜蓉西兰花'];
    } else if (name.includes('黄瓜')) {
      image = RECIPE_IMAGES['凉拌黄瓜'];
    } else if (name.includes('白菜')) {
      image = RECIPE_IMAGES['醋溜白菜'];
    } else if (name.includes('饺子')) {
      image = RECIPE_IMAGES['饺子'];
    } else if (name.includes('包子')) {
      image = RECIPE_IMAGES['包子'];
    } else if (name.includes('馄饨')) {
      image = RECIPE_IMAGES['馄饨'];
    } else {
      // 默认图片
      image = RECIPE_IMAGES['default'];
    }
  }

  // 获取营养信息，如果没有则使用估算值
  let nutritionalInfo = NUTRITION_INFO[recipe.name];
  if (!nutritionalInfo) {
    nutritionalInfo = estimateNutrition(recipe);
  }

  return {
    ...recipe,
    image,
    nutritionalInfo
  };
}

// 为菜谱列表批量添加
export function enhanceRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.map(enhanceRecipe);
}

// 根据人数调整食材用量
export function adjustIngredientsForServings(
  ingredients: string[],
  originalServings: number,
  targetServings: number
): string[] {
  if (originalServings === targetServings) return ingredients;

  const ratio = targetServings / originalServings;
  return ingredients.map(ing => {
    // 尝试提取数量（简单实现，只处理数字开头的情况）
    const match = ing.match(/^(\d+(?:\.\d+)?)(\s*)(.+)/);
    if (match) {
      const [, amount, space, name] = match;
      const newAmount = (parseFloat(amount) * ratio).toFixed(1);
      // 如果是整数就去掉小数点
      const displayAmount = newAmount.endsWith('.0') ? newAmount.slice(0, -2) : newAmount;
      return `${displayAmount}${space}${name}`;
    }
    return ing;
  });
}

// 获取健康标签
export function getHealthLabels(recipe: Recipe): string[] {
  const labels: string[] = [];
  const nutrition = recipe.nutritionalInfo;

  if (!nutrition) return labels;

  // 低卡
  if (nutrition.calories < 200) labels.push('低卡');

  // 高蛋白
  const proteinNum = parseInt(nutrition.protein);
  if (proteinNum > 20) labels.push('高蛋白');

  // 低脂
  const fatNum = parseInt(nutrition.fat);
  if (fatNum < 10) labels.push('低脂');

  return labels;
}

// 根据人数调整营养信息
export function adjustNutritionForServings(
  nutrition: NonNullable<Recipe['nutritionalInfo']>,
  originalServings: number,
  targetServings: number
): {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
} {
  const ratio = targetServings / originalServings;

  // 辅助函数：调整带有单位的营养值
  const adjustNutrient = (value: string): string => {
    const match = value.match(/^(\d+(?:\.\d+)?)(.+)/);
    if (match) {
      const [, amount, unit] = match;
      const newAmount = (parseFloat(amount) * ratio).toFixed(1);
      // 如果是整数就去掉小数点
      const displayAmount = newAmount.endsWith('.0') ? newAmount.slice(0, -2) : newAmount;
      return `${displayAmount}${unit}`;
    }
    return value;
  };

  return {
    calories: Math.round(nutrition.calories * ratio),
    protein: adjustNutrient(nutrition.protein),
    carbs: adjustNutrient(nutrition.carbs),
    fat: adjustNutrient(nutrition.fat)
  };
}
