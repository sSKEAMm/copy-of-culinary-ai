
import { DietRequirement, KitchenUtensils, ChefSkillLevel, Recipe } from './types';

export const DIET_OPTIONS: DietRequirement[] = [
  DietRequirement.KETO,
  DietRequirement.VEGETARIAN,
  DietRequirement.VEGAN,
  DietRequirement.GLUTEN_FREE,
  DietRequirement.PESCATARIAN,
  DietRequirement.PALEO,
  DietRequirement.NONE,
];

export const KITCHEN_UTENSILS_OPTIONS: KitchenUtensils[] = [
  KitchenUtensils.BASIC_SET,
  KitchenUtensils.MICROWAVE,
  KitchenUtensils.OVEN,
  KitchenUtensils.BLENDER,
  KitchenUtensils.FOOD_PROCESSOR,
  KitchenUtensils.STAND_MIXER,
  KitchenUtensils.SLOW_COOKER,
  KitchenUtensils.PRESSURE_COOKER,
  KitchenUtensils.AIR_FRYER,
  KitchenUtensils.GRILL,
  KitchenUtensils.TOASTER,
  KitchenUtensils.WAFFLE_IRON,
];

export const CHEF_SKILL_LEVEL_OPTIONS: ChefSkillLevel[] = [
  ChefSkillLevel.BEGINNER,
  ChefSkillLevel.INTERMEDIATE,
  ChefSkillLevel.ADVANCED,
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Speedy Tomato Pasta',
    description: 'A quick and delicious pasta dish perfect for weeknights.',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 2,
    ingredients: [
      { name: 'Pasta', quantity: '200', unit: 'g' },
      { name: 'Canned Tomatoes', quantity: '1', unit: 'can' },
      { name: 'Garlic', quantity: '2', unit: 'cloves' },
      { name: 'Olive Oil', quantity: '1', unit: 'tbsp' },
      { name: 'Basil', quantity: 'a few', unit: 'leaves' },
    ],
    instructions: [
      'Cook pasta according to package directions.',
      'While pasta cooks, heat olive oil in a pan. Add minced garlic and cook until fragrant.',
      'Pour in canned tomatoes, season with salt and pepper. Simmer for 5-7 minutes.',
      'Drain pasta and add to the sauce. Toss to combine. Serve topped with fresh basil.'
    ],
    imageUrl: 'https://picsum.photos/seed/modernpasta/400/300',
    category: '15-Min Dinners',
  },
  {
    id: '2',
    name: 'Hearty Lentil Soup',
    description: 'Nutritious and budget-friendly lentil soup, perfect for a cozy meal.',
    prepTime: '10 mins',
    cookTime: '30 mins',
    servings: 4,
    ingredients: [
      { name: 'Red Lentils', quantity: '1', unit: 'cup' },
      { name: 'Vegetable Broth', quantity: '4', unit: 'cups' },
      { name: 'Onion', quantity: '1', unit: 'medium' },
      { name: 'Carrots', quantity: '2', unit: 'medium' },
      { name: 'Celery', quantity: '2', unit: 'stalks' },
      { name: 'Cumin', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      'Chop onion, carrots, and celery.',
      'Sauté vegetables in a large pot until softened.',
      'Rinse lentils and add to the pot along with vegetable broth and cumin.',
      'Bring to a boil, then reduce heat and simmer for 20-25 minutes, or until lentils are tender.',
      'Season with salt and pepper to taste.'
    ],
    imageUrl: 'https://picsum.photos/seed/veggiesoup/400/300',
    category: 'Budget Friendly',
  },
  {
    id: '3',
    name: 'Grilled Chicken Salad with Avocado',
    description: 'A light, satisfying, and protein-packed salad with creamy avocado.',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: 2,
    ingredients: [
      { name: 'Chicken Breast', quantity: '2', unit: 'pcs' },
      { name: 'Mixed Greens', quantity: '100', unit: 'g' },
      { name: 'Cherry Tomatoes', quantity: '1/2', unit: 'cup' },
      { name: 'Cucumber', quantity: '1/2', unit: 'medium' },
      { name: 'Avocado', quantity: '1', unit: 'small' },
      { name: 'Olive Oil', quantity: '2', unit: 'tbsp' },
      { name: 'Lemon Juice', quantity: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Season chicken breasts and grill until cooked through. Let rest and slice.',
      'Chop tomatoes, cucumber, and slice avocado.',
      'In a large bowl, combine mixed greens, tomatoes, and cucumber.',
      'Top with sliced grilled chicken and avocado.',
      'Whisk together olive oil and lemon juice for dressing. Drizzle over salad.'
    ],
    imageUrl: 'https://picsum.photos/seed/freshsalad/400/300',
    category: 'High Protein',
  },
  {
    id: '4',
    name: 'Gourmet Beef Tacos with Chipotle Crema',
    description: 'Elevate taco night with flavorful beef tacos and a smoky chipotle crema.',
    prepTime: '20 mins',
    cookTime: '25 mins',
    servings: 4,
    ingredients: [
      { name: 'Ground Beef', quantity: '500', unit: 'g' },
      { name: 'Taco Shells', quantity: '12', unit: 'pcs' },
      { name: 'Avocado', quantity: '1', unit: 'large' },
      { name: 'Red Onion', quantity: '1/2', unit: 'small' },
      { name: 'Cilantro', quantity: '1/4', unit: 'cup' },
      { name: 'Lime', quantity: '1', unit: '' },
      { name: 'Sour Cream', quantity: '1/2', unit: 'cup' },
      { name: 'Chipotle in Adobo', quantity: '1', unit: 'tbsp, minced' },
    ],
    instructions: [
      'Brown ground beef, drain excess fat. Season with taco seasoning.',
      'Dice avocado and red onion. Chop cilantro.',
      'For chipotle crema: mix sour cream with minced chipotle and a squeeze of lime.',
      'Warm taco shells according to package instructions.',
      'Assemble tacos with beef, avocado, red onion, cilantro, and a drizzle of chipotle crema.'
    ],
    imageUrl: 'https://picsum.photos/seed/spicytacos/400/300',
    category: 'Weekend Specials',
  }
];

export const API_KEY_CHECK_INTERVAL = 5000; // Check for API key every 5 seconds
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

// Algolia Configuration (to be populated by environment variables)
export const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || null;
export const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || null;
export const ALGOLIA_INDEX_NAME = import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'recipes';
export const ALGOLIA_CONFIG_CHECK_INTERVAL = 5000; // Check for Algolia config every 5 seconds

export const DEBOUNCE_DELAY = 500; // ms for search input debounce