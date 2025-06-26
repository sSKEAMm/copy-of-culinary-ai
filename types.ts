
export interface User {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  provider: 'google' | 'apple' | 'mock';
}

export enum DietRequirement {
  KETO = 'Keto',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'Gluten-Free',
  PESCATARIAN = 'Pescatarian',
  PALEO = 'Paleo',
  NONE = 'None'
}

export enum KitchenUtensils {
  BASIC_SET = 'Basic (Pots, Pans, Knives)',
  MICROWAVE = 'Microwave',
  OVEN = 'Oven',
  BLENDER = 'Blender',
  FOOD_PROCESSOR = 'Food Processor',
  STAND_MIXER = 'Stand Mixer',
  SLOW_COOKER = 'Slow Cooker (Crockpot)',
  PRESSURE_COOKER = 'Pressure Cooker (Instant Pot)',
  AIR_FRYER = 'Air Fryer',
  GRILL = 'Grill / BBQ',
  TOASTER = 'Toaster',
  WAFFLE_IRON = 'Waffle Iron',
}

export enum ChefSkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface UserPreferences {
  dietaryRequirements: DietRequirement[];
  kitchenUtensils: KitchenUtensils[]; // Changed to array
  chefSkillLevel: ChefSkillLevel;
  servings: number;
  weeklyBudget: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string; // e.g., "15 mins"
  cookTime: string; // e.g., "30 mins"
  servings: number;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  imageUrl: string;
  category?: string; // e.g., "15-Min Dinners", "Budget Friendly"
  aiGenerated?: boolean;
  dietTags?: DietRequirement[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  isChecked: boolean;
  recipeId?: string; // Optional: to link item to a recipe
}

// For Gemini API response parsing (example structure)
export interface AiRecipeResponse {
  recipeName: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  notes?: string;
  dietTags?: DietRequirement[];
}