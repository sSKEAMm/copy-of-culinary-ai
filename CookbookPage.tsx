
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  TextInput, 
  Button, 
  Grid, 
  Group, 
  Stack, 
  Alert, 
  Paper,
  Space,
  ActionIcon,
  Loader,
  Center
} from '@mantine/core';
import RecipeCard from '../components/shared/RecipeCard';
import { MOCK_RECIPES, GEMINI_MODEL_TEXT, ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_INDEX_NAME, DEBOUNCE_DELAY } from '../constants';
import { Recipe, UserPreferences, DietRequirement, AiRecipeResponse, KitchenUtensils } from '../types';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { usePreferences } from '../contexts/PreferencesContext';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { searchRecipesAlgolia, isAlgoliaConfigured as checkAlgoliaConfig } from '../services/algoliaService';
import { SparklesIcon, FilterIcon, MagnifyingGlassIcon } from '../components/icons/FeatureIcons';

// Helper function to create a more specific prompt
const createRecipePrompt = (preferences: UserPreferences | null, customInput: { ingredients?: string; mealType?: string; cravings?: string }): string => {
  let prompt = "You are a creative chef. Generate a unique recipe.\n";
  prompt += "The response MUST be a single JSON object. Do NOT use markdown like ```json ... ```.\n";
  prompt += "The JSON object should have the following keys: 'recipeName' (string), 'description' (string, max 150 chars), 'servings' (number), 'prepTime' (string, e.g., '15 mins'), 'cookTime' (string, e.g., '20 mins'), 'ingredients' (array of objects with 'name', 'quantity', 'unit'), 'instructions' (array of strings), 'notes' (string, optional), 'dietTags' (array of DietRequirement strings, if applicable).\n";

  if (preferences) {
    if (preferences.dietaryRequirements.length > 0 && !preferences.dietaryRequirements.includes(DietRequirement.NONE)) {
      prompt += `It must be suitable for these diets: ${preferences.dietaryRequirements.join(', ')}.\n`;
    }
    prompt += `It should be for ${preferences.servings} servings.\n`;
    prompt += `The cook should be a ${preferences.chefSkillLevel} level.\n`;

    if (preferences.kitchenUtensils && preferences.kitchenUtensils.length > 0) {
      const utensilList = preferences.kitchenUtensils.join(', ');
      prompt += `The kitchen is equipped with at least the following: ${utensilList}. Consider these when suggesting cooking methods.\n`;
    } else {
      prompt += `Assume basic kitchen utensils (pots, pans, knives) are available.\n`;
    }

    if (preferences.weeklyBudget > 0) {
        prompt += `It should be relatively budget-friendly, considering a weekly budget of $${preferences.weeklyBudget}.\n`;
    }
  }

  if (customInput.mealType) {
    prompt += `This recipe is for ${customInput.mealType}.\n`;
  }
  if (customInput.ingredients) {
    prompt += `Try to incorporate these ingredients: ${customInput.ingredients}.\n`;
  }
  if (customInput.cravings) {
    prompt += `The user is craving something ${customInput.cravings}.\n`;
  }
  
  prompt += "Please provide a creative and appealing recipe name. Keep instructions clear and concise.";
  return prompt;
};

const CookbookPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAiRecipe, setIsLoadingAiRecipe] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [aiIngredients, setAiIngredients] = useState('');
  const [aiMealType, setAiMealType] = useState('');
  const [aiCravings, setAiCravings] = useState('');

  const { preferences } = usePreferences();
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  const isAlgoliaEffectivelyConfigured = checkAlgoliaConfig();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Perform search when debouncedSearchTerm changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setRecipes(MOCK_RECIPES);
        setIsLoadingSearch(false);
        setSearchError(null);
        return;
      }

      if (isAlgoliaEffectivelyConfigured) {
        setIsLoadingSearch(true);
        setSearchError(null);
        try {
          const algoliaResults = await searchRecipesAlgolia(debouncedSearchTerm);
          setRecipes(algoliaResults);
          if (algoliaResults.length === 0) {
            setSearchError(`No recipes found for "${debouncedSearchTerm}" in our Algolia index.`);
          }
        } catch (error) {
          console.error("Algolia search failed:", error);
          setSearchError(`Algolia search failed. Displaying local results if any. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          // Fallback to local MOCK_RECIPES search on Algolia error
          const localResults = MOCK_RECIPES.filter(recipe =>
            recipe.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
          setRecipes(localResults);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        // Algolia not configured, perform local search on MOCK_RECIPES
        setIsLoadingSearch(true); // briefly show loading for local search consistency
        const localResults = MOCK_RECIPES.filter(recipe =>
          recipe.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setRecipes(localResults);
        setSearchError("Algolia is not configured. Showing local results.");
        setIsLoadingSearch(false);
         if (localResults.length === 0) {
            setSearchError(`No local recipes found for "${debouncedSearchTerm}". Algolia is not configured.`);
        }
      }
    };

    performSearch();
  }, [debouncedSearchTerm, isAlgoliaEffectivelyConfigured]);


  const handleGenerateAiRecipe = useCallback(async () => {
    if (!geminiApiKey) {
      setAiError("Gemini API Key is not configured. Cannot generate AI recipe.");
      setIsLoadingAiRecipe(false);
      return;
    }
    setIsLoadingAiRecipe(true);
    setAiError(null);

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const prompt = createRecipePrompt(preferences, { ingredients: aiIngredients, mealType: aiMealType, cravings: aiCravings });

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      let jsonStr = response.text?.trim() || '';
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData: AiRecipeResponse = JSON.parse(jsonStr);
      
      const newAiRecipe: Recipe = {
        id: `ai-${Date.now()}`,
        name: parsedData.recipeName,
        description: parsedData.description,
        prepTime: parsedData.prepTime,
        cookTime: parsedData.cookTime,
        servings: parsedData.servings,
        ingredients: parsedData.ingredients,
        instructions: parsedData.instructions,
        imageUrl: `https://picsum.photos/seed/ai-${Math.random().toString(36).substring(7)}/400/300`,
        aiGenerated: true,
        dietTags: parsedData.dietTags || [],
        category: "AI Generated"
      };
      setRecipes(prev => [newAiRecipe, ...prev]); // Prepend to current list
      setIsModalOpen(false);
      setAiIngredients('');
      setAiMealType('');
      setAiCravings('');

    } catch (error) {
      console.error("Error generating AI recipe:", error);
      setAiError(`Failed to generate recipe. ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
    } finally {
      setIsLoadingAiRecipe(false);
    }
  }, [geminiApiKey, preferences, aiIngredients, aiMealType, aiCravings]);


  return (
    <Container size="xl" px="md" py="lg">
      <Stack align="center" mb="xl">
        <Title order={1} c="primary.5" ta="center">
          Your Cookbook
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          Explore recipes or get AI suggestions!
        </Text>
      </Stack>

      {!geminiApiKey && (
        <Alert color="yellow" title="Gemini API Key Missing" mb="md">
          AI recipe generation will be unavailable.
        </Alert>
      )}
      
      {!isAlgoliaEffectivelyConfigured && debouncedSearchTerm && (
        <Alert color="orange" title="Algolia Not Configured" mb="md">
          Recipe search is using local data. For enhanced search, configure Algolia.
        </Alert>
      )}


      <Group mb="xl" align="flex-end">
        <TextInput
          leftSection={<MagnifyingGlassIcon style={{ width: 20, height: 20 }} />}
          placeholder="Search recipes (e.g., chicken, pasta)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flex: 1 }}
          size="md"
        />
        <Button
          leftSection={<SparklesIcon style={{ width: 18, height: 18 }} />}
          onClick={() => setIsModalOpen(true)}
          disabled={!geminiApiKey}
          color="orange"
          size="md"
        >
          Get AI Recipe
        </Button>
        <Button
          leftSection={<FilterIcon style={{ width: 18, height: 18 }} />}
          onClick={() => alert("Filter functionality coming soon!")}
          variant="light"
          color="gray"
          size="md"
        >
          Filter
        </Button>
      </Group>

      {isLoadingSearch && (
        <Center py="xl">
          <Stack align="center">
            <Loader color="primary" size="lg" />
            <Text c="dimmed">Searching recipes...</Text>
          </Stack>
        </Center>
      )}
      
      {searchError && !isLoadingSearch && (
        <Alert color="yellow" mb="md">
          {searchError}
        </Alert>
      )}

      {!isLoadingSearch && recipes.length > 0 ? (
        <Grid>
          {recipes.map(recipe => (
            <Grid.Col key={recipe.id} span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
              <RecipeCard recipe={recipe} />
            </Grid.Col>
          ))}
        </Grid>
      ) : !isLoadingSearch && !searchError && recipes.length === 0 && debouncedSearchTerm ? (
        <Center py="xl">
          <Text c="dimmed" size="lg" ta="center">
            No recipes found for "{debouncedSearchTerm}". Try a different search or generate one with AI!
          </Text>
        </Center>
      ) : !isLoadingSearch && recipes.length === 0 && !debouncedSearchTerm ? (
        <Center py="xl">
          <Text c="dimmed" size="lg" ta="center">
            Your cookbook is ready. Search for recipes or use AI to generate new ideas!
          </Text>
        </Center>
      ) : null}


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="✨ AI Recipe Generator">
        {isLoadingAiRecipe ? (
          <LoadingSpinner text="Generating your masterpiece..." />
        ) : (
          <Stack gap="md">
            {aiError && (
              <Alert color="red" title="Error">
                {aiError}
              </Alert>
            )}
            <TextInput
              label="Key ingredients you have/want to use (optional)"
              value={aiIngredients}
              onChange={(e) => setAiIngredients(e.currentTarget.value)}
              placeholder="e.g., chicken, tomatoes, pasta"
            />
            <TextInput
              label="Meal type (e.g., breakfast, quick snack)"
              value={aiMealType}
              onChange={(e) => setAiMealType(e.currentTarget.value)}
              placeholder="e.g., dinner, lunch, snack"
            />
            <TextInput
              label="Any specific cravings? (e.g., spicy, comforting)"
              value={aiCravings}
              onChange={(e) => setAiCravings(e.currentTarget.value)}
              placeholder="e.g., spicy, sweet, healthy"
            />
            <Text size="xs" c="dimmed">
              Your dietary preferences, skill level, and servings will be automatically considered.
            </Text>
            <Button 
              onClick={handleGenerateAiRecipe} 
              fullWidth
              color="primary"
              size="md"
            >
              Generate Recipe
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default CookbookPage;