import { Recipe, MatchedRecipe } from '@/types';
import { matchIngredient } from './utils';
import { enhanceRecipe } from './recipe-enhancements';

// 菜谱数据库
export const RECIPES: Recipe[] = [
  // 早餐类
  {
    id: '1',
    name: '番茄炒蛋',
    ingredients: ['番茄', '鸡蛋', '盐', '糖', '葱'],
    steps: ['番茄切块，鸡蛋打散', '热锅炒鸡蛋盛出', '炒番茄出汁', '加入鸡蛋翻炒', '调味出锅'],
    category: 'breakfast',
    time: 10,
    difficulty: 'easy',
    tags: ['家常', '快手'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  },
  {
    id: '2',
    name: '牛奶鸡蛋吐司',
    ingredients: ['牛奶', '鸡蛋', '面包'],
    steps: ['吐司切丁', '鸡蛋加牛奶打散', '吐司裹蛋液', '平底锅煎至金黄'],
    category: 'breakfast',
    time: 8,
    difficulty: 'easy',
    tags: ['西式', '早餐'],
  },
  {
    id: '3',
    name: '燕麦粥',
    ingredients: ['燕麦', '牛奶', '糖'],
    steps: ['燕麦加牛奶', '小火煮5分钟', '加糖调味即可'],
    category: 'breakfast',
    time: 5,
    difficulty: 'easy',
    tags: ['健康', '快手'],
  },

  // 午餐/晚餐类
  {
    id: '4',
    name: '宫保鸡丁',
    ingredients: ['鸡肉', '花生', '青椒', '辣椒', '蒜', '酱油', '料酒', '糖', '醋'],
    steps: ['鸡肉切丁腌制', '花生炸酥', '炒鸡丁变色', '加调料和配菜', '最后加花生翻炒'],
    category: 'lunch',
    time: 20,
    difficulty: 'medium',
    tags: ['川菜', '经典'],
  },
  {
    id: '5',
    name: '麻婆豆腐',
    ingredients: ['豆腐', '猪肉', '豆瓣酱', '蒜', '姜', '葱', '酱油', '花椒'],
    steps: ['豆腐切块焯水', '炒肉末', '加豆瓣酱炒香', '加豆腐和调料', '勾芡出锅'],
    category: 'dinner',
    time: 15,
    difficulty: 'medium',
    tags: ['川菜', '下饭'],
  },
  {
    id: '6',
    name: '红烧肉',
    ingredients: ['猪肉', '糖', '酱油', '料酒', '姜', '葱'],
    steps: ['猪肉切块焯水', '炒糖色', '加肉翻炒上色', '加调料炖煮', '大火收汁'],
    category: 'dinner',
    time: 60,
    difficulty: 'medium',
    tags: ['家常', '下饭'],
  },
  {
    id: '7',
    name: '番茄鸡蛋面',
    ingredients: ['番茄', '鸡蛋', '面条', '葱', '盐'],
    steps: ['番茄炒出汁', '加水煮开', '下面条', '加鸡蛋', '调味出锅'],
    category: 'lunch',
    time: 15,
    difficulty: 'easy',
    tags: ['面食', '快手'],
  },
  {
    id: '8',
    name: '土豆炖牛肉',
    ingredients: ['牛肉', '土豆', '胡萝卜', '洋葱', '酱油', '料酒', '姜'],
    steps: ['牛肉焯水', '炒牛肉变色', '加调料和水', '加蔬菜炖煮', '收汁出锅'],
    category: 'dinner',
    time: 50,
    difficulty: 'medium',
    tags: ['炖菜', '家常'],
  },
  {
    id: '9',
    name: '青椒肉丝',
    ingredients: ['猪肉', '青椒', '酱油', '料酒', '盐'],
    steps: ['肉丝腌制', '青椒切丝', '炒肉丝', '加青椒翻炒', '调味出锅'],
    category: 'lunch',
    time: 12,
    difficulty: 'easy',
    tags: ['家常', '快手'],
  },
  {
    id: '10',
    name: '鱼香肉丝',
    ingredients: ['猪肉', '胡萝卜', '青椒', '木耳', '蒜', '糖', '醋', '酱油', '料酒'],
    steps: ['肉丝腌制', '配菜切丝', '炒肉丝', '加配菜和鱼香汁', '翻炒均匀'],
    category: 'lunch',
    time: 15,
    difficulty: 'medium',
    tags: ['川菜', '经典'],
  },
  {
    id: '11',
    name: '蒜蓉西兰花',
    ingredients: ['西兰花', '蒜', '盐', '蚝油'],
    steps: ['西兰花焯水', '爆香蒜蓉', '加西兰花翻炒', '调味出锅'],
    category: 'lunch',
    time: 8,
    difficulty: 'easy',
    tags: ['素食', '健康'],
  },
  {
    id: '12',
    name: '红烧茄子',
    ingredients: ['茄子', '蒜', '酱油', '糖', '醋', '葱'],
    steps: ['茄子切块撒盐', '炒软盛出', '爆香调料', '加茄子翻炒', '收汁出锅'],
    category: 'dinner',
    time: 20,
    difficulty: 'medium',
    tags: ['家常', '下饭'],
  },
  {
    id: '13',
    name: '酸辣土豆丝',
    ingredients: ['土豆', '辣椒', '蒜', '醋', '盐'],
    steps: ['土豆切丝泡水', '爆香辣椒和蒜', '炒土豆丝', '加醋调味', '出锅'],
    category: 'lunch',
    time: 10,
    difficulty: 'easy',
    tags: ['家常', '开胃'],
  },
  {
    id: '14',
    name: '糖醋排骨',
    ingredients: ['排骨', '糖', '醋', '酱油', '料酒', '姜'],
    steps: ['排骨焯水', '炸至金黄', '炒糖色', '加排骨和调料', '收汁出锅'],
    category: 'dinner',
    time: 40,
    difficulty: 'medium',
    tags: ['家常', '经典'],
  },
  {
    id: '15',
    name: '清蒸鱼',
    ingredients: ['鱼', '葱', '姜', '酱油', '料酒'],
    steps: ['鱼处理干净', '抹料酒腌制', '放葱段姜丝', '蒸8-10分钟', '淋酱油热油'],
    category: 'dinner',
    time: 15,
    difficulty: 'easy',
    tags: ['粤菜', '清淡'],
  },
  {
    id: '16',
    name: '可乐鸡翅',
    ingredients: ['鸡肉', '可乐', '酱油', '姜', '葱'],
    steps: ['鸡翅焯水', '煎至两面金黄', '加可乐和调料', '小火收汁', '出锅'],
    category: 'dinner',
    time: 25,
    difficulty: 'easy',
    tags: ['家常', '儿童最爱'],
  },
  {
    id: '17',
    name: '回锅肉',
    ingredients: ['猪肉', '青椒', '蒜苗', '豆瓣酱', '酱油', '糖'],
    steps: ['猪肉煮熟切片', '炒出油', '加豆瓣酱', '加配菜翻炒', '调味出锅'],
    category: 'dinner',
    time: 20,
    difficulty: 'medium',
    tags: ['川菜', '下饭'],
  },
  {
    id: '18',
    name: '白菜炖豆腐',
    ingredients: ['白菜', '豆腐', '猪肉', '姜', '葱', '盐'],
    steps: ['白菜豆腐切块', '炒猪肉', '加水和调料', '炖煮10分钟', '出锅'],
    category: 'dinner',
    time: 20,
    difficulty: 'easy',
    tags: ['炖菜', '家常'],
  },
  {
    id: '19',
    name: '蒜蓉炒青菜',
    ingredients: ['生菜', '蒜', '盐', '蚝油'],
    steps: ['生菜洗净', '爆香蒜蓉', '大火炒生菜', '调味出锅'],
    category: 'lunch',
    time: 5,
    difficulty: 'easy',
    tags: ['素食', '快手'],
  },
  {
    id: '20',
    name: '咖喱鸡肉饭',
    ingredients: ['鸡肉', '土豆', '胡萝卜', '洋葱', '咖喱块', '米饭'],
    steps: ['配菜切块', '炒鸡肉', '加蔬菜炒', '加水煮', '加咖喱块', '淋在饭上'],
    category: 'dinner',
    time: 25,
    difficulty: 'easy',
    tags: ['异国', '下饭'],
  },
  {
    id: '21',
    name: '西红柿鸡蛋汤',
    ingredients: ['番茄', '鸡蛋', '葱', '盐', '香油'],
    steps: ['番茄炒出汁', '加水煮开', '淋入蛋液', '调味撒葱花', '滴香油'],
    category: 'lunch',
    time: 8,
    difficulty: 'easy',
    tags: ['汤', '快手'],
  },
  {
    id: '22',
    name: '冬瓜排骨汤',
    ingredients: ['冬瓜', '排骨', '姜', '葱', '盐'],
    steps: ['排骨焯水', '加姜煮40分钟', '加冬瓜煮10分钟', '调味出锅'],
    category: 'dinner',
    time: 50,
    difficulty: 'easy',
    tags: ['汤', '清淡'],
  },
  {
    id: '23',
    name: '干煸豆角',
    ingredients: ['豆角', '猪肉', '辣椒', '蒜', '酱油', '盐'],
    steps: ['豆角撕筋切段', '煸炒至表皮起皱', '炒肉末', '加豆角和调料', '翻炒均匀'],
    category: 'dinner',
    time: 15,
    difficulty: 'medium',
    tags: ['川菜', '下饭'],
  },
  {
    id: '24',
    name: '韭菜炒鸡蛋',
    ingredients: ['韭菜', '鸡蛋', '盐'],
    steps: ['韭菜切段', '鸡蛋炒散盛出', '炒韭菜', '加鸡蛋翻炒', '调味出锅'],
    category: 'lunch',
    time: 8,
    difficulty: 'easy',
    tags: ['家常', '快手'],
  },
  {
    id: '25',
    name: '黄焖鸡米饭',
    ingredients: ['鸡肉', '土豆', '青椒', '香菇', '酱油', '糖', '米饭'],
    steps: ['鸡肉腌制', '炒鸡肉', '加配菜', '加调料焖煮', '淋在饭上'],
    category: 'dinner',
    time: 25,
    difficulty: 'medium',
    tags: ['快餐', '下饭'],
  },
  {
    id: '26',
    name: '皮蛋瘦肉粥',
    ingredients: ['大米', '皮蛋', '猪肉', '姜', '葱', '盐'],
    steps: ['大米煮粥', '猪肉切丝焯水', '皮蛋切块', '加肉和皮蛋煮', '调味撒葱花'],
    category: 'breakfast',
    time: 40,
    difficulty: 'medium',
    tags: ['粥', '广东'],
  },
  {
    id: '27',
    name: '蚂蚁上树',
    ingredients: ['粉丝', '猪肉', '豆瓣酱', '蒜', '葱', '酱油'],
    steps: ['粉丝泡软', '炒肉末', '加豆瓣酱', '加粉丝和调料', '翻炒均匀'],
    category: 'dinner',
    time: 12,
    difficulty: 'medium',
    tags: ['川菜', '下饭'],
  },
  {
    id: '28',
    name: '清炒时蔬',
    ingredients: ['菠菜', '蒜', '盐', '蚝油'],
    steps: ['菠菜洗净', '爆香蒜', '大火快炒', '调味出锅'],
    category: 'lunch',
    time: 5,
    difficulty: 'easy',
    tags: ['素食', '健康'],
  },
  {
    id: '29',
    name: '东坡肉',
    ingredients: ['猪肉', '糖', '酱油', '料酒', '姜', '葱'],
    steps: ['猪肉切块焯水', '炒糖色', '加肉翻炒', '加调料慢炖', '收汁出锅'],
    category: 'dinner',
    time: 90,
    difficulty: 'hard',
    tags: ['浙菜', '经典'],
  },
  {
    id: '30',
    name: '扬州炒饭',
    ingredients: ['米饭', '鸡蛋', '虾仁', '火腿', '豌豆', '葱', '盐'],
    steps: ['配料切丁', '炒鸡蛋', '炒配料', '加米饭翻炒', '调味出锅'],
    category: 'lunch',
    time: 10,
    difficulty: 'medium',
    tags: ['炒饭', '经典'],
  },
  {
    id: '31',
    name: '酸辣汤',
    ingredients: ['豆腐', '木耳', '鸡蛋', '醋', '胡椒粉', '淀粉'],
    steps: ['豆腐木耳切丝', '煮汤', '加配料', '勾芡淋蛋液', '加醋和胡椒粉'],
    category: 'lunch',
    time: 10,
    difficulty: 'medium',
    tags: ['汤', '开胃'],
  },
  {
    id: '32',
    name: '京酱肉丝',
    ingredients: ['猪肉', '甜面酱', '豆腐皮', '葱', '酱油', '糖'],
    steps: ['肉丝腌制', '炒酱', '加肉丝翻炒', '用豆腐皮卷着吃'],
    category: 'dinner',
    time: 20,
    difficulty: 'medium',
    tags: ['京菜', '经典'],
  },
  {
    id: '33',
    name: '红烧带鱼',
    ingredients: ['带鱼', '酱油', '糖', '醋', '料酒', '姜', '葱'],
    steps: ['带鱼切段', '炸至金黄', '加调料焖煮', '收汁出锅'],
    category: 'dinner',
    time: 25,
    difficulty: 'medium',
    tags: ['海鲜', '家常'],
  },
  {
    id: '34',
    name: '蛋炒饭',
    ingredients: ['米饭', '鸡蛋', '葱', '盐'],
    steps: ['鸡蛋炒散', '加米饭翻炒', '调味撒葱花', '出锅'],
    category: 'breakfast',
    time: 5,
    difficulty: 'easy',
    tags: ['快手', '经典'],
  },
  {
    id: '35',
    name: '白灼菜心',
    ingredients: ['菜心', '蒜', '蚝油', '生抽'],
    steps: ['菜心焯水', '调蘸料', '淋在菜心上'],
    category: 'lunch',
    time: 5,
    difficulty: 'easy',
    tags: ['粤菜', '清淡'],
  },
  {
    id: '36',
    name: '地三鲜',
    ingredients: ['土豆', '茄子', '青椒', '蒜', '酱油', '糖'],
    steps: ['三种食材过油', '炒香蒜', '加食材翻炒', '调味勾芡', '出锅'],
    category: 'dinner',
    time: 20,
    difficulty: 'medium',
    tags: ['东北菜', '下饭'],
  },
  {
    id: '37',
    name: '水煮鱼',
    ingredients: ['鱼', '豆芽', '白菜', '辣椒', '花椒', '豆瓣酱', '蒜'],
    steps: ['鱼片腌制', '炒豆瓣酱', '加水煮', '加菜和鱼', '泼热油'],
    category: 'dinner',
    time: 30,
    difficulty: 'hard',
    tags: ['川菜', '麻辣'],
  },
  {
    id: '38',
    name: '蛋花汤',
    ingredients: ['鸡蛋', '葱', '盐', '香油', '淀粉'],
    steps: ['水开调味', '勾芡', '淋蛋液', '撒葱花滴香油'],
    category: 'lunch',
    time: 5,
    difficulty: 'easy',
    tags: ['汤', '快手'],
  },
  {
    id: '39',
    name: '葱爆羊肉',
    ingredients: ['羊肉', '大葱', '酱油', '料酒', '盐'],
    steps: ['羊肉切片', '大葱切段', '大火爆炒羊肉', '加大葱', '调味出锅'],
    category: 'dinner',
    time: 8,
    difficulty: 'medium',
    tags: ['清真', '快手'],
  },
  {
    id: '40',
    name: '蒜泥白肉',
    ingredients: ['猪肉', '蒜', '酱油', '醋', '糖', '辣椒油'],
    steps: ['猪肉煮熟', '切薄片', '调蒜泥酱汁', '淋在肉片上'],
    category: 'dinner',
    time: 30,
    difficulty: 'easy',
    tags: ['川菜', '凉菜'],
  },
];

// 菜谱匹配算法
export function matchRecipes(userIngredients: string[]): MatchedRecipe[] {
  if (!userIngredients || userIngredients.length === 0) {
    return [];
  }

  return RECIPES
    .map(recipe => {
      // 先增强菜谱（添加图片和营养信息）
      const enhanced = enhanceRecipe(recipe);

      // 找出匹配的食材
      const matchedIngredients = recipe.ingredients.filter(recipeIng =>
        userIngredients.some(userIng =>
          matchIngredient(userIng, recipeIng)
        )
      );

      // 找出缺少的食材
      const missingIngredients = recipe.ingredients.filter(
        recipeIng => !matchedIngredients.includes(recipeIng)
      );

      // 计算匹配分数
      const matchScore = recipe.ingredients.length > 0
        ? matchedIngredients.length / recipe.ingredients.length
        : 0;

      return {
        ...enhanced,
        matchScore,
        matchedIngredients,
        missingIngredients,
        canCook: matchScore >= 0.5 // 至少匹配50%才能做
      };
    })
    .filter(r => r.matchScore > 0) // 至少匹配一个食材
    .sort((a, b) => b.matchScore - a.matchScore); // 按匹配度排序
}

// 根据 ID 获取菜谱
export function getRecipeById(id: string): Recipe | undefined {
  const recipe = RECIPES.find(r => r.id === id);
  return recipe ? enhanceRecipe(recipe) : undefined;
}

// 搜索菜谱（按名称或食材）
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return RECIPES
    .filter(recipe =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery)) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .map(enhanceRecipe);
}

// 获取推荐菜谱（随机）
export function getFeaturedRecipes(count = 6): Recipe[] {
  const shuffled = [...RECIPES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(enhanceRecipe);
}
