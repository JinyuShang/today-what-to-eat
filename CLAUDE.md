# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"今天吃什么" (What to Eat Today) is a hackathon project - a recipe recommendation app where users input available ingredients and get intelligent recipe suggestions. Built for quick deployment (1-hour target), it uses a pure frontend architecture with no backend required.

**Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS + LocalStorage

## Common Commands

```bash
# Development
npm run dev          # Start dev server (default port 3000)

# Build & Deploy
npm run build        # Production build
npm run lint         # Run ESLint
npm start            # Start production server

# Deployment
vercel               # Deploy via Vercel CLI
```

## Architecture

### Data Flow (Three-Way Sync)

The app has three interconnected data systems that sync via Custom Events and LocalStorage:

1. **Pantry (库存)** - `localStorage: 'pantry-items'` - User's available ingredients
2. **Menu (菜单)** - `localStorage: 'menu-items'` - Planned recipes to cook
3. **Shopping List (清单)** - `localStorage: 'shopping-list'` - Missing ingredients to buy

**Key Events**:
- `pantry-updated` → Re-renders recipes with new match scores
- `recipes-need-update` → Forces recipe recalculation
- `open-shopping-list` → Opens shopping list modal
- `reset-shopping-list` → Clears shopping list
- `favorite-changed` → Syncs favorite state across components

**Global Window APIs** (used for cross-component communication):
- `window.addRecipeToMenu(recipe)` - Add recipe to menu
- `window.addShoppingItems(ingredients[])` - Add ingredients to shopping list

### Recipe Matching Algorithm

Located in `lib/recipe-db.ts`, the `matchRecipes()` function:

1. Takes user's ingredient list
2. Uses `matchIngredient()` from `lib/utils.ts` for fuzzy matching
3. Supports ingredient aliases (e.g., "番茄" = "西红柿")
4. Calculates match score = `matchedIngredients / totalIngredients`
5. Returns recipes sorted by match score (descending)
6. Only shows recipes with at least one matching ingredient

**Fuzzy Matching Logic** (`lib/utils.ts:matchIngredient()`):
- Exact match first
- Common aliases (土豆 → 马铃薯/洋芋)
- Substring matching (with safeguards against false positives)
- Excludes generic terms like "肉", "菜", "蛋" when used standalone

### Recipe Enhancement Pipeline

All recipes flow through `enhanceRecipe()` in `lib/recipe-enhancements.ts`:

1. **Image Assignment** - Maps recipe names to Unsplash images
2. **Nutrition Info** - Adds calorie/macro data (or estimates if missing)
3. **Health Labels** - Auto-tags as "低卡", "高蛋白", "低脂"

### Serving Size Calculator

Global servings state (1-6 people) is stored in `localStorage: 'servings'` and managed in `app/page.tsx`:

- Adjusts ingredient quantities via `adjustIngredientsForServings()`
- Scales nutrition info via `adjustNutritionForServings()`
- Passed as prop to all recipe-displaying components

## Important Type Definitions

**MatchedRecipe** (`types/index.ts`):
- Extends base `Recipe` with:
  - `matchScore: number` (0-1)
  - `matchedIngredients: string[]`
  - `missingIngredients: string[]`
  - `canCook: boolean` (matchScore >= 0.5)

**ShoppingItem** (`types/index.ts`):
- `name: string` - Full name with quantity (e.g., "番茄 300g")
- `pureName?: string` - Just the ingredient (e.g., "番茄")
- Used for deduplication when adding items

## Component Architecture

### Main Page (`app/page.tsx`)
- **Single Source of Truth** for:
  - `ingredients` state (synced to pantry)
  - `servings` state (global serving size)
  - All modal visibility states
- Handles URL parsing for shared links
- Emits events to update other panels

### Recipe Display Flow
```
RecipeList (container)
  └── RecipeCard (individual recipe)
       ├── Shows matched/missing ingredients
       ├── Expandable steps
       ├── Favorite toggle (uses storage.ts)
       └── "Add to Menu" button (calls window.addRecipeToMenu)
```

### Panel Components
- **PantryPanel** - Manage inventory, triggers `pantry-updated` event
- **MenuPanel** - Shows planned recipes, calculates total missing ingredients
- **FavoritesPanel** - Uses `storage.ts` functions for CRUD
- **ShoppingList** - Auto-categorizes items, marks as "purchased" adds to pantry

## Mobile Optimizations

All interactive elements meet iOS 44×44px minimum touch target:

- Buttons: `min-h-[44px] min-w-[44px]` or `min-h-[48px]`
- Bottom nav: Fixed position with `pb-safe` for iPhone home indicator
- Touch feedback: `touch-manipulation` class + `:active { transform: scale(0.97) }`
- Input font-size: `16px` prevents iOS auto-zoom
- Safe areas: `env(safe-area-inset-bottom)` for notch/home indicator

## Known Issues & Gotchas

1. **Duplicate Object Keys** - The `RECIPE_IMAGES` constant in `lib/recipe-enhancements.ts` had duplicate entries (e.g., '西红柿炒鸡蛋' appeared twice). Always check for duplicates when adding new recipe mappings.

2. **Ingredient Matching Too Permissive** - Generic terms like "肉" can match too many recipes. The `matchIngredient()` function excludes patterns like `['肉', '菜', '豆', '粉', '瓜', '椒', '蛋']` when used standalone.

3. **LocalStorage Sync Timing** - When updating pantry items, dispatch `pantry-updated` event AFTER saving to localStorage to ensure listeners read updated data.

4. **Vercel Build Errors** - Type errors in TypeScript will fail deployment. Common causes:
   - Duplicate object keys
   - Missing imports
   - Type mismatches in props

## Adding New Features

### Adding a New Recipe

1. Add to `RECIPES` array in `lib/recipe-db.ts`
2. Optionally add image mapping to `RECIPE_IMAGES` in `lib/recipe-enhancements.ts`
3. Optionally add nutrition info to `NUTRITION_INFO` in `lib/recipe-enhancements.ts`

### Extending Ingredient Matching

Add aliases to the `aliases` object in `lib/utils.ts:matchIngredient()`:
```typescript
const aliases: Record<string, string[]> = {
  '新食材': ['别名1', '别名2'],
  // ...
};
```

### Adding New Categories

1. Update `INGREDIENT_CATEGORIES` in `types/index.ts`
2. Update `getIngredientCategory()` in `lib/utils.ts`
3. Add category label in ShoppingList component

## File Structure Notes

- **`lib/recipe-enhancements.ts`** - Large file containing image mappings, nutrition data, and helper functions
- **`lib/ingredient-portions.ts`** - Maps ingredients to per-serving quantities for shopping list calculations
- **No API routes** - Pure client-side app, no backend required
- **`app/page.tsx`** - Main entry point, handles all global state
- **Components use `'use client'`** - All components are client-side (Next.js 14 App Router)
